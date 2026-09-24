param([string]$GameFolder)
$ErrorActionPreference = 'Stop'
try {
 if (!$GameFolder) {
  Add-Type -AssemblyName System.Windows.Forms
  $picker = New-Object System.Windows.Forms.FolderBrowserDialog
  $picker.Description = 'Choose the Japanese game folder containing ORE_TUBA.EXE. Close the game first.'
  if ($picker.ShowDialog() -ne 'OK') { exit 0 }
  $GameFolder = $picker.SelectedPath
 }
 $GameFolder = (Resolve-Path -LiteralPath $GameFolder).Path
 $manifest = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'patch.json') -Raw | ConvertFrom-Json
 function Hash($p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant() }
 $dataPath = Join-Path $PSScriptRoot 'patch.dat'
 $fontPath = Join-Path $PSScriptRoot 'mao-font.ttf'
 if ((Hash $dataPath) -ne $manifest.payload_sha256 -or (Hash $fontPath) -ne $manifest.font_sha256) { throw 'Patch files are damaged. Download the archive again.' }
 $pending = @()
 foreach ($file in $manifest.files) {
  $path = Join-Path $GameFolder $file.name
  if (!(Test-Path -LiteralPath $path)) { throw "Missing $($file.name). Choose the game installation folder." }
  $hash = Hash $path
  if ($hash -eq $file.output_sha256) { continue }
  if ($hash -in @($file.previous_output_sha256)) {
   $saved = Join-Path (Join-Path $GameFolder 'MAO-original-backup') $file.name
   if (!(Test-Path -LiteralPath $saved) -or (Hash $saved) -ne $file.source_sha256) { throw 'Updating requires the matching original in MAO-original-backup. No game files were changed.' }
  } elseif ($hash -ne $file.source_sha256) { throw "$($file.name) does not match Japanese v1.00 or this patch. No game files were changed." }
  $pending += $file
 }
 $stage = Join-Path $GameFolder ('MAO-patch-' + [Guid]::NewGuid().ToString('N'))
 New-Item -ItemType Directory -Path $stage | Out-Null
 try {
  foreach ($file in $pending) {
   $sourcePath = Join-Path $GameFolder $file.name
   if ((Hash $sourcePath) -in @($file.previous_output_sha256)) { $sourcePath = Join-Path (Join-Path $GameFolder 'MAO-original-backup') $file.name }
   $source = [IO.File]::OpenRead($sourcePath)
   $data = [IO.File]::OpenRead($dataPath)
   $targetPath = Join-Path $stage $file.name
   $target = [IO.File]::Create($targetPath)
   try {
    $buffer = New-Object byte[] 65536
    foreach ($op in $file.operations) {
     $inputStream = if ($op[0] -eq 'source') { $source } else { $data }
     $null = $inputStream.Seek([long]$op[1], [IO.SeekOrigin]::Begin)
     $remaining = [long]$op[2]
     while ($remaining -gt 0) {
      $count = $inputStream.Read($buffer, 0, [int][Math]::Min($remaining, $buffer.Length))
      if ($count -eq 0) { throw 'Unexpected end of patch data.' }
      $target.Write($buffer, 0, $count); $remaining -= $count
     }
    }
   } finally { $source.Dispose(); $data.Dispose(); $target.Dispose() }
   if ((Hash $targetPath) -ne $file.output_sha256 -or (Get-Item -LiteralPath $targetPath).Length -ne $file.output_size) { throw 'Output verification failed. No game files were changed.' }
  }
  # Install the licensed font for this user, without administrator privileges.
  $fontDir = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Fonts'
  New-Item -ItemType Directory -Force -Path $fontDir | Out-Null
  $installedFont = Join-Path $fontDir ('MAOGothicQ2-' + $manifest.font_sha256 + '.ttf')
  # Fonts may remain locked by Windows after the game exits. Never overwrite
  # an installed font: identical content is reused, new content gets a new path.
  if (Test-Path -LiteralPath $installedFont) {
   if ((Hash $installedFont) -ne $manifest.font_sha256) { throw 'An installed font file is damaged. No game files were changed.' }
  } else {
   Copy-Item -LiteralPath $fontPath -Destination $installedFont
  }
  $key = 'HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts'
  New-Item -Path $key -Force | Out-Null
  New-ItemProperty -Path $key -Name 'MAO Gothic Q2 (TrueType)' -Value $installedFont -PropertyType String -Force | Out-Null
  Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class MaoFonts { [DllImport("gdi32.dll", CharSet=CharSet.Unicode)] public static extern int AddFontResourceEx(string p, uint f, IntPtr r); [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern IntPtr SendMessageTimeout(IntPtr h, uint m, IntPtr w, IntPtr l, uint f, uint t, out IntPtr r); }'
  if ([MaoFonts]::AddFontResourceEx($installedFont, 0, [IntPtr]::Zero) -eq 0) { throw 'Could not load the bundled font. No game files were changed.' }
  $result = [IntPtr]::Zero
  $null = [MaoFonts]::SendMessageTimeout([IntPtr]0xffff, 0x1d, [IntPtr]::Zero, [IntPtr]::Zero, 2, 1000, [ref]$result)
  $backup = Join-Path $GameFolder 'MAO-original-backup'
  New-Item -ItemType Directory -Force -Path $backup | Out-Null
  foreach ($file in $pending) {
   $saved = Join-Path $backup $file.name
   if ((Test-Path -LiteralPath $saved) -and (Hash $saved) -ne $file.source_sha256) { throw 'An existing backup differs. Preserve it elsewhere before continuing.' }
  }
  foreach ($file in $pending) {
   $saved = Join-Path $backup $file.name
   if (!(Test-Path -LiteralPath $saved)) { Copy-Item -LiteralPath (Join-Path $GameFolder $file.name) -Destination $saved }
  }
  try {
   foreach ($file in $pending) { Copy-Item -LiteralPath (Join-Path $stage $file.name) -Destination (Join-Path $GameFolder $file.name) -Force }
  } catch {
   foreach ($file in $pending) { Copy-Item -LiteralPath (Join-Path $backup $file.name) -Destination (Join-Path $GameFolder $file.name) -Force }
   throw
  }
 } finally { Remove-Item -LiteralPath $stage -Recurse -Force }
 Write-Host 'English v1.1.1 installed. Originals are in MAO-original-backup. Start ORE_TUBA.EXE.' -ForegroundColor Green
} catch { Write-Host ('Installation stopped: ' + $_.Exception.Message) -ForegroundColor Red; exit 1 }

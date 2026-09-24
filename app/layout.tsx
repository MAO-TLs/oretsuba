import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
export const metadata: Metadata = {
  title: { default: "Oretachi ni Tsubasa wa Nai | MAO", template: "%s | MAO" },
  description: "The complete MAO English translation of Oretachi ni Tsubasa wa Nai. Download the patch and browse the Japanese/English script.",
  robots: { index: true, follow: true },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}

import { InstallAnchorRelease } from "./InstallAnchorRelease";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import index from "../public/script-data/index.json";

export const dynamic = "force-static";

export default function Home() {
  return (
    <main>
      <InstallAnchorRelease />
      <section className="hero">
        <picture>
          <img
            className="hero-backdrop"
            src="./shinjuku-neon-night.png"
            alt=""
            aria-hidden="true"
          />
        </picture>
        <SiteNav
          releaseHref="./"
          scriptHref="./script/"
          currentPage="release"
        />

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow">An English translation by MAO</p>
            <h1>
              ORETACHI&nbsp;NI
              <br />
              TSUBASA&nbsp;WA
              <br />
              NAI
            </h1>
            <p className="dek">
              Navel’s magnum opus <em>Oretachi ni Tsubasa wa Nai</em> is now
              available for the first time in English. A complete translation
              from the Japanese, with attention to accuracy, character voice,
              and natural literary English.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="https://github.com/MAO-TLs/oretsuba/releases/download/v1.1.6/OreTsuba-English-v1.1.6.zip">
                Download complete release
                <span aria-hidden="true">↓</span>
              </a>
              <a className="button button-secondary" href="./script/">
                Script
                <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className="compatibility">
              12.5 MB · <a href="https://github.com/MAO-TLs/oretsuba/releases/tag/v1.1.6">Release notes</a>
              {" "}· Version 1.1.6 · Japanese retail v1.00 required
            </p>
          </div>

          <div aria-hidden="true" />
        </div>
      </section>

      <section className="release-strip" aria-label="Release information">
        <div className="shell release-grid">
          <div>
            <span className="release-label">Version</span>
            <strong>v1.1.6</strong>
          </div>
          <div>
            <span className="release-label">Script coverage</span>
            <strong>Main game</strong>
          </div>
          <div>
            <span className="release-label">Lines</span>
            <strong>{index.totalLines.toLocaleString()}</strong>
          </div>
          <div>
            <span className="release-label">Status</span>
            <strong className="release-status">Available</strong>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <p className="eyebrow">Read online</p>
          <h2>Browse the complete script</h2>
          <p>
            Every main-game line is browsable beside its
            Japanese source. Search the current scene or the complete corpus,
            then jump directly to any reference.
          </p>
        </div>
        <div className="chapter-grid">
          {index.routes.filter(route => route.id !== "section-00").map((route, i) => (
            <a
              className="chapter-card"
              href={`./script/?route=${route.id}&script=${route.scripts[0].id}`}
              key={route.id}
            >
              <span className="chapter-number">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{route.label}</h3>
                <p>{route.lineCount.toLocaleString()} lines · {route.scripts.length} scripts</p>
              </div>
            </a>
          ))}
        </div>
        <a className="text-link" href="./script/">
          Open the script browser <span aria-hidden="true">→</span>
        </a>
      </section>

      <section className="install-section" id="install">
        <div className="section shell">
          <div className="install-heading">
            <div className="section-heading">
              <p className="eyebrow">Installation</p>
              <h2>How to install the patch</h2>
            </div>
            <p className="install-requirement">
              Requires a legally obtained Japanese <em>Oretachi ni Tsubasa wa Nai</em>
              {" "}retail v1.00 installation. The installer checks that your original files match before applying the patch.
            </p>
          </div>

          <ol className="install-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Back up the originals</h3>
                <p>Keep a backup of your unmodified Japanese installation and saves before applying the English patch.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Apply the English patch</h3>
                <p>Extract the ZIP, run “Install English Patch.cmd,” and select the Japanese game folder. The installer includes the required font and keeps a backup of the original files.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Start the game</h3>
                <p>Launch ORE_TUBA.EXE. On macOS, use the included Python installer with your Wine installation; see README.txt in the download for the command. Restart your Wine wrapper after installation.</p>
              </div>
            </li>
          </ol>
          <aside className="install-warning">
            <strong>Platform validation</strong>
            <p>The opening and prologue were visually checked on macOS with Sikarugir/Wine. Full-game playthrough and native Windows testing are not complete.</p>
          </aside>
        </div>
      </section>

      <section className="section shell credits-section">
        <div className="section-heading">
          <p className="eyebrow">Credits</p>
          <h2>MAO Translations</h2>
        </div>
        <dl className="credits">
          <div>
            <dt>Project Lead</dt>
            <dd>MAO</dd>
          </div>
          <div>
            <dt>Translator</dt>
            <dd>GPT-6 Astra</dd>
          </div>
          <div>
            <dt>Special Thanks</dt>
            <dd>gambs</dd>
          </div>
        </dl>
      </section>

      <SiteFooter />
    </main>
  );
}

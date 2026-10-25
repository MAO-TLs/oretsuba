import { SiteNav } from "../SiteNav";
import { SiteFooter } from "../SiteFooter";
import { ScriptBrowser } from "./ScriptBrowser";
import stats from "../../public/script-data/summary.json";
export default function ScriptPage() { return <main className="reader-page">
  <header className="reader-header"><SiteNav releaseHref="../" scriptHref="./" currentPage="script" />
  <div className="reader-intro shell"><p className="eyebrow">Script version {stats.version}</p><h1>Script browser</h1><p>Search the {stats.totalLines.toLocaleString()}-line corpus across <em>Oretachi ni Tsubasa wa Nai</em>, Prelude, and AfterStory, or choose one of {stats.totalScripts} scripts. Japanese and the MAO English translation are presented side by side, with full-script search and direct passage links.</p></div></header>
  <ScriptBrowser /><SiteFooter /></main>; }

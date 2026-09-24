import { SiteNav } from "../SiteNav";
import { SiteFooter } from "../SiteFooter";
import { ScriptBrowser } from "./ScriptBrowser";
import stats from "../../public/script-data/summary.json";
export default function ScriptPage() { return <main className="reader-page">
  <header className="reader-header"><SiteNav releaseHref="../" scriptHref="./" currentPage="script" />
  <div className="reader-intro shell"><p className="eyebrow">Script version · v1.1.3</p><h1>Script browser</h1><p>Search the {stats.totalLines.toLocaleString()}-line corpus or read any of its {stats.totalScripts} scripts beside the MAO English translation of <em>Oretachi ni Tsubasa wa Nai</em>. Japanese and English are presented side by side, with full-script search and direct passage links.</p></div></header>
  <ScriptBrowser /><SiteFooter /></main>; }

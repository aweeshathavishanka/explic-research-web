import { ArrowDown, ArrowRight } from "lucide-react";
import { textBranches, textExplainability, voiceBranches, voiceExplainability } from "@/data/domain";

type NodeProps = {
  kicker: string;
  title: string;
  detail?: React.ReactNode;
  tone?: "default" | "accent";
  className?: string;
};

function Node({ kicker, title, detail, tone = "default", className = "" }: NodeProps) {
  const toneClass = tone === "accent" ? "border-accent-line bg-accent-surface" : "border-line bg-bg";
  return (
    <div className={`rounded-lg border px-4 py-3 ${toneClass} ${className}`}>
      <p className={`font-mono text-[11px] ${tone === "accent" ? "text-accent-text" : "text-subtle"}`}>{kicker}</p>
      <p className="mt-1 text-sm font-medium leading-snug text-fg">{title}</p>
      {detail ? <div className="mt-1 text-[13px] leading-relaxed text-muted">{detail}</div> : null}
    </div>
  );
}

/** Curved connectors between one node and N stacked nodes (fan-out or fan-in). */
function Fan({ direction, count }: { direction: "out" | "in"; count: number }) {
  const ys = Array.from({ length: count }, (_, i) => ((i + 0.5) / count) * 100);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
      {ys.map((y) => (
        <path
          key={y}
          d={direction === "out" ? `M0 50 C 55 50, 45 ${y}, 100 ${y}` : `M0 ${y} C 55 ${y}, 45 50, 100 50`}
          fill="none"
          stroke="var(--c-line-strong)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

function Right() {
  return (
    <div className="flex items-center justify-center" aria-hidden>
      <ArrowRight className="size-4 text-subtle" strokeWidth={1.5} />
    </div>
  );
}

function Down() {
  return (
    <div className="flex justify-center py-1.5" aria-hidden>
      <ArrowDown className="size-4 text-subtle" strokeWidth={1.5} />
    </div>
  );
}

function Frame({ id, title, note, children }: { id: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <figure aria-labelledby={id} className="reveal overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-4 sm:px-6">
        <p id={id} className="font-medium text-fg">
          {title}
        </p>
        <p className="font-mono text-xs text-subtle">{note}</p>
      </div>
      <div className="space-y-8 p-5 sm:p-6 lg:p-8">{children}</div>
    </figure>
  );
}

function LaneLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-xs text-subtle">{children}</p>;
}

const fusionFormula = (
  <span className="block font-mono text-xs leading-5">
    <span className="block whitespace-nowrap">
      s = Σ w<sub>i</sub>s<sub>i</sub>
    </span>
    <span className="block whitespace-nowrap">
      w<sub>i</sub> ≥ 0, Σ w<sub>i</sub> = 1
    </span>
  </span>
);

const preprocessDetail = "Decoded to mono 16 kHz, then windowed and normalised per branch";

const voiceNodes = voiceBranches.map((b) => ({ kicker: b.family, title: b.name, detail: `App: ${b.appName}` }));

/** Voice research pipeline: Components 1 (detection) and 4 (explanation). */
export function VoiceArchitecture() {
  return (
    <Frame id="voice-arch-caption" title="Voice track" note="Components 1 and 4">
      <div>
        <LaneLabel>Detection lane, C1</LaneLabel>
        {/* Desktop */}
        <div className="hidden grid-cols-[minmax(0,1fr)_44px_minmax(0,1.2fr)_44px_minmax(0,1fr)_28px_minmax(0,0.9fr)] lg:grid">
          <div className="flex items-center">
            <Node kicker="Input and preprocessing" title="Recording" detail={preprocessDetail} className="w-full" />
          </div>
          <Fan direction="out" count={4} />
          <div className="grid grid-rows-4 gap-2">
            {voiceNodes.map((n) => (
              <Node key={n.title} {...n} />
            ))}
          </div>
          <Fan direction="in" count={4} />
          <div className="flex items-center">
            <Node tone="accent" kicker="Score fusion" title="Convex fusion" detail={fusionFormula} className="w-full" />
          </div>
          <Right />
          <div className="flex items-center">
            <Node kicker="Output" title="Bona fide or spoof" detail="With branch-level scores" className="w-full" />
          </div>
        </div>
        {/* Mobile and tablet */}
        <div className="lg:hidden">
          <Node kicker="Input and preprocessing" title="Recording" detail={preprocessDetail} />
          <Down />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {voiceNodes.map((n) => (
              <Node key={n.title} {...n} />
            ))}
          </div>
          <Down />
          <Node tone="accent" kicker="Score fusion" title="Convex fusion" detail={fusionFormula} />
          <Down />
          <Node kicker="Output" title="Bona fide or spoof" detail="With branch-level scores" />
        </div>
      </div>

      <div>
        <LaneLabel>Explanation lane, C4 (reads branch internals; cannot change the prediction)</LaneLabel>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {voiceExplainability.map((n) => (
            <li key={n.title}>
              <Node kicker={n.kind} title={n.title} detail={n.detail} className="h-full" />
            </li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}

const textBranchNodes = textBranches.map((b) => ({ kicker: b.family, title: b.name, detail: b.detail }));

/** Text research pipeline as implemented in the Explic application: Components 3 and 2. */
export function TextArchitecture() {
  return (
    <Frame id="text-arch-caption" title="Text track" note="Components 3 and 2">
      <div>
        <LaneLabel>Detection lane, C3</LaneLabel>
        <div className="hidden grid-cols-[minmax(0,0.8fr)_24px_minmax(0,1fr)_44px_minmax(0,1.3fr)_44px_minmax(0,1fr)_24px_minmax(0,1fr)] lg:grid">
          <div className="flex items-center">
            <Node kicker="Input" title="Passage of text" className="w-full" />
          </div>
          <Right />
          <div className="flex items-center">
            <Node kicker="Sanitisation" title="Adversarial filtering" detail="Ten attack categories tested" className="w-full" />
          </div>
          <Fan direction="out" count={2} />
          <div className="grid grid-rows-2 gap-2">
            {textBranchNodes.map((n) => (
              <Node key={n.title} {...n} />
            ))}
          </div>
          <Fan direction="in" count={2} />
          <div className="flex items-center">
            <Node tone="accent" kicker="Agreement" title="CSS-v2 conflict score" detail="Disagreement is measured" className="w-full" />
          </div>
          <Right />
          <div className="flex items-center">
            <Node kicker="Output" title="Three labels" detail="AI-Generated, Human-Written, or Mixed Content" className="w-full" />
          </div>
        </div>
        <div className="lg:hidden">
          <Node kicker="Input" title="Passage of text" />
          <Down />
          <Node kicker="Sanitisation" title="Adversarial filtering" detail="Ten attack categories tested" />
          <Down />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {textBranchNodes.map((n) => (
              <Node key={n.title} {...n} />
            ))}
          </div>
          <Down />
          <Node tone="accent" kicker="Agreement" title="CSS-v2 conflict score" detail="Disagreement is measured" />
          <Down />
          <Node kicker="Output" title="Three labels" detail="AI-Generated, Human-Written, or Mixed Content" />
        </div>
      </div>

      <div>
        <LaneLabel>Explanation lane, C2 (HNIF, computed locally with no external language model)</LaneLabel>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {textExplainability.map((n) => (
            <li key={n.title}>
              <Node kicker={n.kind} title={n.title} detail={n.detail} className="h-full" />
            </li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}

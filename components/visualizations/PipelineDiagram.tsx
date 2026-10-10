import { pipelineStages } from "@/data/domain";

/** High-level process shared by both modalities. */
export function PipelineDiagram() {
  return (
    <figure aria-label="Overall Explic research process, in six stages" className="reveal">
      <ol className="grid gap-0 lg:grid-cols-6">
        {pipelineStages.map((stage, i) => {
          const last = i === pipelineStages.length - 1;
          return (
            <li key={stage.label} className="relative flex gap-5 pb-8 lg:block lg:pb-0 lg:pr-4">
              <div aria-hidden className="relative flex flex-col items-center lg:flex-row">
                <span
                  className={`relative flex size-3 shrink-0 rounded-full border-2 ${
                    last ? "border-accent bg-accent" : "border-line-strong bg-bg"
                  }`}
                />
                {!last ? (
                  <>
                    <span className="absolute left-1/2 top-3 h-[calc(100%+2rem)] w-px -translate-x-1/2 bg-line-strong lg:hidden" />
                    <span className="ml-2 hidden h-px flex-1 bg-line-strong lg:block" />
                  </>
                ) : null}
              </div>
              <div className="-mt-1 lg:mt-5">
                <p className="font-medium text-fg">{stage.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{stage.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

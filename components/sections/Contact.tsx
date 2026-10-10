import { ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/data/site-content";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/SectionHeading";

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-title">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h2 id="contact-title" className="reveal text-[2.25rem] font-medium leading-[1.08] text-fg sm:text-5xl lg:text-[3.5rem]">
            Questions about the research?
          </h2>
          <p className="reveal mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">
            We welcome academic inquiries from evaluators, researchers, and anyone interested in detecting and
            explaining synthetic media.
          </p>
          <div className="reveal mt-9">
            {site.contactEmail ? (
              <ButtonLink href={`mailto:${site.contactEmail}`} variant="primary">
                <Mail className="size-4" strokeWidth={1.5} aria-hidden />
                Email the research group
              </ButtonLink>
            ) : (
              <p className="inline-flex items-center gap-3 rounded-full border border-dashed border-line-strong px-5 py-3 text-sm text-muted">
                <Mail className="size-4" strokeWidth={1.5} aria-hidden />
                A research contact email will be published here.
              </p>
            )}
          </div>
        </div>

        <dl className="reveal space-y-5 text-[15px] lg:col-span-4 lg:col-start-9 lg:pt-3">
          <div>
            <dt className="text-[13px] text-subtle">Institution</dt>
            <dd className="mt-1 text-fg">
              {site.institution} ({site.institutionShort})
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-subtle">Department</dt>
            <dd className="mt-1 text-fg">{site.department}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-subtle">Programme</dt>
            <dd className="mt-1 text-fg">{site.degree}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-subtle">Project</dt>
            <dd className="mt-1 font-mono text-fg">{site.projectId}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-subtle">Application</dt>
            <dd className="mt-1">
              <a
                href={site.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent-text underline-offset-4 hover:underline"
              >
                explic.vercel.app
                <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </dd>
          </div>
          {site.links.map((l) => (
            <div key={l.href}>
              <dt className="text-[13px] text-subtle">{l.label}</dt>
              <dd className="mt-1">
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-accent-text underline-offset-4 hover:underline">
                  {l.href.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

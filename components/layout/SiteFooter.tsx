import { navItems, site } from "@/data/site-content";
import { Wordmark } from "@/components/ui/Logo";

export function SiteFooter() {
  return (
    <footer id="site-footer" className="page-x border-t border-line py-14">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{site.description}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-4 md:col-start-7">
          <p className="text-sm font-medium text-fg">Sections</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-muted transition-colors duration-200 hover:text-accent-text">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-fg">Project</p>
          <p className="mt-4 font-mono text-sm text-muted">{site.projectId}</p>
          <a
            href={site.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-muted transition-colors duration-200 hover:text-accent-text"
          >
            Explic application
          </a>
        </div>
      </div>

      <div className="mt-14 grid gap-4 border-t border-line pt-6 text-xs leading-relaxed text-subtle md:grid-cols-12">
        <div className="space-y-2 md:col-span-8">
          <p>
            Undergraduate research project of the {site.department}, {site.institution} ({site.institutionShort}). This
            website is maintained by the research group and is not an official SLIIT publication.
          </p>
          <p>{site.disclaimer}</p>
          <p>
            Typefaces: Google Sans and JetBrains Mono, used under the SIL Open Font License (
            <a href="/licenses/GoogleSans-OFL.txt" className="underline underline-offset-2 hover:text-fg">
              Google Sans
            </a>
            ,{" "}
            <a href="/licenses/JetBrainsMono-OFL.txt" className="underline underline-offset-2 hover:text-fg">
              JetBrains Mono
            </a>
            ).
          </p>
        </div>
        <p className="md:col-span-4 md:text-right">
          © {site.copyrightYear} Explic Research Group, {site.projectId}
        </p>
      </div>
    </footer>
  );
}

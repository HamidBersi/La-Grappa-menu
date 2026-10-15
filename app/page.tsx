import { PortalCard, PortalShell } from "@/components/portal-shell";

export default function Home() {
  return (
    <PortalShell>
      <nav className="mt-10 grid w-full gap-4" aria-label="Navigation principale">
        <PortalCard
          href="/portail/menu"
          emoji="🍽️"
          title="Menu"
          description="Carte salle : voir ou gérer."
          className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both delay-150 duration-700"
        />
      </nav>
    </PortalShell>
  );
}

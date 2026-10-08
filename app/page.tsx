import { PortalCard, PortalShell } from "@/components/portal-shell";

export default function Home() {
  return (
    <PortalShell
      eyebrow="La Grappa"
      title="Restaurant Management"
      subtitle="Carte digitale"
    >
      <nav className="mt-12 grid w-full gap-4" aria-label="Navigation principale">
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

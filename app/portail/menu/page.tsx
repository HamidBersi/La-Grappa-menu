import { PortalCard, PortalShell } from "@/components/portal-shell";

export default function MenuPortalPage() {
  return (
    <PortalShell
      eyebrow="Menu"
      title="Que voulez-vous faire ?"
      backHref="/"
      backLabel="← Accueil"
    >
      <nav className="mt-12 grid w-full gap-4" aria-label="Choix menu">
        <PortalCard
          href="/menu?from=app"
          emoji="👁️"
          title="Voir le menu"
          description="Aperçu public — QR, tablette, clients."
        />
        <PortalCard
          href="/admin/menu"
          emoji="🔐"
          title="Espace gérant"
          description="Modifier la carte."
        />
      </nav>
    </PortalShell>
  );
}

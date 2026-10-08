"use client";

import { OwnerGate } from "@/components/menu/owner-gate";
import { PortalCard, PortalShell } from "@/components/portal-shell";

export default function AdminPage() {
  return (
    <OwnerGate>
      <PortalShell
        eyebrow="La Grappa"
        title="Espace gérant"
        backHref="/"
        backLabel="← Accueil"
      >
        <nav className="mt-12 grid w-full gap-4">
          <PortalCard
            href="/admin/menu"
            emoji="🍽️"
            title="Gérer la carte"
            description="Ajouter, modifier, supprimer les plats."
          />
        </nav>
      </PortalShell>
    </OwnerGate>
  );
}

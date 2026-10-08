"use client";

import { MenuAdminApp } from "@/components/menu/menu-admin-app";
import { OwnerGate } from "@/components/menu/owner-gate";

export default function MenuAdminPage() {
  return (
    <OwnerGate>
      <MenuAdminApp />
    </OwnerGate>
  );
}

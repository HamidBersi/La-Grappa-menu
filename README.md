# La Grappa Menu

**Menu digital multilingue du restaurant La Grappa (Strasbourg), livré au client et utilisé chaque jour par ses clients via QR code.**

Le restaurateur met à jour sa carte lui-même, depuis son téléphone : plats, prix, vins, disponibilités. Les clients scannent un QR code sur la table et lisent la carte dans leur langue. La version imprimable reste toujours à jour.

> _Témoignage client : à ajouter (citation du restaurateur, avec son accord)._

<!-- Captures : ajouter ici 3 images (menu sur mobile, changement de langue, back-office) -->

## Fonctionnalités

| Pour qui | Fonctionnalité |
| --- | --- |
| Clients | **Menu digital** accessible par **QR code**, traduit en **4 langues** (français, anglais, allemand, italien), langue mémorisée sur l'appareil |
| Clients | Navigation par familles de plats ; vins au verre, au quart, au demi ou à la bouteille ; pictos piment, bio, végétarien, vegan |
| Restaurateur | **Back-office** protégé par code PIN : catégories, plats, descriptions, prix, disponibilité |
| Restaurateur | Réordonnancement des plats par **glisser-déposer** ; recherche et restauration des plats supprimés |
| Restaurateur | **Version imprimable** de la carte avec pagination automatique, et génération du QR code |

## Architecture

```
Client (QR code)          Restaurateur (téléphone)
       │                          │
       ▼                          ▼
   Next.js (App Router, React 19, TypeScript)
   ├── Pages : /menu (menu client), /portail (back-office)
   └── API REST : /api/menu, /api/menu/items, /api/menu/qr, /api/owner
            │  Prisma ORM
            ▼
        PostgreSQL
```

**Stack :** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Prisma 6 · PostgreSQL · dnd-kit · qrcode

## Exploitation et sécurité

- **Accès restaurateur** protégé par code PIN ; session signée en HMAC-SHA256 dans un cookie `httpOnly`, `secure` en production, `sameSite=lax`.
- **Anti-force brute** : blocage après 5 essais ratés par adresse IP pendant 15 minutes.
- **Secrets** uniquement dans les variables d'environnement, jamais dans le code (voir `.env.example`).
- **Mises en production** : le build applique automatiquement les migrations de base de données (`prisma migrate deploy`) avant de compiler l'application.

## Lancer le projet en local

```bash
pnpm install
cp .env.example .env              # puis renseigner les valeurs
pnpm prisma migrate deploy        # crée les tables
pnpm menu:seed                    # charge la carte de départ
pnpm dev                          # http://localhost:3000
```

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Connexion PostgreSQL |
| `OWNER_PIN` | Code PIN du restaurateur |
| `SESSION_SECRET` | Clé de signature des sessions (`openssl rand -hex 32`) |

## Auteur

**Hamid Bersi** – conception, développement, mise en production et maintenance pour le client.

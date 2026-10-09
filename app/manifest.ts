import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Grappa — Carte digitale",
    short_name: "La Grappa",
    description: "Carte digitale du restaurant La Grappa",
    start_url: "/menu",
    display: "standalone",
    background_color: "#F4F1EA",
    theme_color: "#1E3A2F",
    orientation: "any",
    icons: [
      {
        src: "/icons/icon-192.png?v=2",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png?v=2",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Grappa — Carte digitale",
    short_name: "La Grappa",
    description: "Carte digitale du restaurant La Grappa",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4EF",
    theme_color: "#009246",
    orientation: "any",
    icons: [
      {
        src: "/icons/icon-192.png?v=10",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png?v=10",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

export default function manifest() {
  return {
    name: "54 Belmont Road Finances",
    short_name: "54 Finances",
    description: "54 Belmont Road finance management application.",
    icons: [
      {
        src: "../public/72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "../public/192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "../public/512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",
    start_url: "/",
    scope: ".",
    display: "standalone",
    orientation: "portrait",
  };
}

import { defineManifest } from "@crxjs/vite-plugin";

//@ts-ignore
const isDev = process.env.NODE_ENV == "development";

// chrome manifest
export default defineManifest({
  name: `Note It ${isDev ? "- Dev" : ""}`,
  description:
    "Note It - A Free, Open Source, Minimalist Browser Extension for Students & Researchers",
  manifest_version: 3,
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  action: {
    default_icon: "img/favicon.png",
    default_popup: "popup.html",
  },
  content_scripts: [
    {
      js: ["src/contentScript/index.ts"],
      matches: ["<all_urls>"],
    },
  ],
  icons: {
    "32": "img/favicon.png",
  },
  permissions: ["contextMenus", "tabs", "activeTab", "storage", "downloads"],
  host_permissions: ["http://*/", "https://*/"],
  version: "1.0",
  web_accessible_resources: [
    {
      resources: ["img/*.jpg"],
      matches: ["<all_urls>"],
    },
  ],
});

/// <reference types="vite/client" />

import firefox from "@types/firefox-webext-browser";

declare const browser: typeof import("webextension-polyfill");
declare const __APP_VERSION__: string;

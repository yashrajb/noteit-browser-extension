import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

// chrome manifest
export default defineManifest({
  name: `note it ${isDev ? '- Dev' : ''}`,
  manifest_version: 3,
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  action: {
    default_icon: 'img/favicon.png',
    default_popup: 'popup.html',
  },
  content_scripts: [
    {
      js: ['src/contentScript/index.ts'],
      matches: ['<all_urls>'],
    },
  ],
  icons: {
    '32': 'img/favicon.png',
  },
  permissions: ['contextMenus', 'tabs', 'activeTab', 'storage', 'downloads'],
  host_permissions: ['http://*/', 'https://*/'],
  version: '1.0',
  web_accessible_resources: [
    {
      resources: ['img/*.jpg'],
      matches: ['<all_urls>'],
    },
  ],
})

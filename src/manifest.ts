import { ManifestV3Export } from '@crxjs/vite-plugin';

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Obake Extension',
  description: 'Browser extension for Obake Terminal',
  version: '0.1',
  background: {
    service_worker: 'src/background/index.ts',
  },
  options_ui: {
    page: 'src/options/options.html',
    open_in_tab: true,
  },
  web_accessible_resources: [
    {
      resources: [
        // this file is web accessible; it supports HMR b/c it's declared in `rollupOptions.input`
        'src/welcome/welcome.html',
      ],
      matches: ['<all_urls>'],
    },
  ],
  action: {
    default_popup: 'src/popup/popup.html',
    default_icon: {
      '256': 'images/extension_256.png',
    },
  },
  icons: {
    '256': 'images/extension_256.png',
  },
  permissions: ['tabGroups', 'tabs', 'notifications', 'unlimitedStorage', 'storage'],
};

export default manifest;

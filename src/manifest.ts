import { ManifestV3Export } from '@crxjs/vite-plugin';

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Obake Extension',
  description: 'Browser extension for Obake Terminal',
  version: '0.1',
  background: {
    service_worker: 'src/background/index.ts',
  },
  host_permissions: ['<all_urls>'],
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
      '16': 'images/extension_16.png',
      '32': 'images/extension_32.png',
      '48': 'images/extension_48.png',
      '128': 'images/extension_128.png',
    },
  },
  icons: {
    '16': 'images/extension_16.png',
    '32': 'images/extension_32.png',
    '48': 'images/extension_48.png',
    '128': 'images/extension_128.png',
  },
  permissions: ['tabGroups', 'tabs', 'notifications', 'unlimitedStorage', 'storage'],
};

export default manifest;

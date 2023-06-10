import browser from 'webextension-polyfill';

import { isDev } from '../shared/utils';
import { setBadgeBackgroundColor, setBadgeTextColor } from '../shared/utils/badge';

import { SessionManageService } from './services/session-manage.service';

const init = async () => {
  await SessionManageService.create();
  await setBadgeBackgroundColor('#FFFFFF');
  setBadgeTextColor('#000000');
};

init();

// show welcome page on new install
browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    //show the welcome page
    const url = browser.runtime.getURL(isDev ? 'src/welcome/welcome.html' : 'welcome.html'); // TODO: better approach
    await browser.tabs.create({ url });
  }
});

export {};

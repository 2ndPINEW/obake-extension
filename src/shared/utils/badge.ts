import browser from 'webextension-polyfill';

export const setBadgeText = async (text: string) => {
  await browser.action.setBadgeText({ text });
};

export const setBadgeBackgroundColor = async (color: string) => {
  await browser.action.setBadgeBackgroundColor({ color });
};

export const setBadgeTextColor = (color: string) => {
  browser.action.setBadgeTextColor({ color });
};

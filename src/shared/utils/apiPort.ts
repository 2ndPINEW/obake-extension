import browser from 'webextension-polyfill';

import { API_HOST, API_PROTOCOL } from '../constants/api';

export const readApiPort = async (): Promise<number> => {
  const { apiPort } = await browser.storage.sync.get('apiPort');
  return apiPort || 9435;
};

export const writeApiPort = async (port: number): Promise<void> => {
  await browser.storage.sync.set({ apiPort: port });
};

export const apiBase = async (): Promise<string> => {
  const apiPort = await readApiPort();
  return `${API_PROTOCOL}://${API_HOST}:${apiPort}`;
};

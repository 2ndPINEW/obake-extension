import { API_HOST, API_PROTOCOL } from '../constants/api';
import { WorkspaceManagerInfo } from '../types/workspace';

import { readApiPort } from './apiPort';

const apiBase = async () => {
  const apiPort = await readApiPort();
  return `${API_PROTOCOL}://${API_HOST}:${apiPort}`;
};

export const getTerminalWorkspaceManagerInfo = async (): Promise<WorkspaceManagerInfo> => {
  const response = await fetch(`${await apiBase()}/workspaces`);
  return await response.json();
};

export const switchTerminalWorkspace = async (workspaceId: string) => {
  await fetch(`${await apiBase()}/workspaces/switch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workspaceId }),
  });
};

import browser, { Tabs } from 'webextension-polyfill';

import { SESSION_RECHECK_MESSAGE_TYPE } from '../../shared/constants/message';
import {
  CURRENT_SESSION_KEY,
  MODE_KEY,
  SESSION_SAVE_PREFIX,
} from '../../shared/constants/storageKey';
import { getTerminalWorkspaceManagerInfo } from '../../shared/utils/api';
import { setBadgeText } from '../../shared/utils/badge';

/**
 * セッション管理するためのサービス
 * await SessionManageService.create() でインスタンスを生成する
 */
export class SessionManageService {
  // 外からインスタンスを生成できないようにprivateにする
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static create = async () => {
    const sessionManageService = new SessionManageService();
    await sessionManageService.initHandlers();
    return sessionManageService;
  };

  private initHandlers = async () => {
    browser.windows.onFocusChanged.addListener(() => {
      this.checkSessionChange();
    });

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === SESSION_RECHECK_MESSAGE_TYPE) {
        this.checkSessionChange();
      }
    });

    browser.commands.onCommand.addListener((command) => {
      console.log(command);
      switch (command) {
        case 'switchMode':
          this.switchMode();
          break;
      }
    });

    this.checkSessionChange();
  };

  private checkSessionChange = async () => {
    const mode = await this.getMode();
    const currentTerminalWorkspaceInfo = await getTerminalWorkspaceManagerInfo();
    const currentSessionInfo = await this.getBrowserCurrentSessionInfo();
    const activeTerminalWorkspace = currentTerminalWorkspaceInfo.workspaces.find(
      (workspace) => workspace.status === 'ACTIVE'
    );
    if (!activeTerminalWorkspace) {
      setBadgeText('None');
      return;
    }
    if (!currentSessionInfo) {
      // 多分初回起動時
      await this.saveBrowserCurrentSessionName(activeTerminalWorkspace.name);
      await this.saveBrowserSessionTabs(activeTerminalWorkspace.name);
      setBadgeText(activeTerminalWorkspace.name);
      return;
    }
    // モードがFREEになった時はFREEモードにする
    if (mode === 'FREE' && currentSessionInfo.name !== mode) {
      const freeSessionInfo = await this.getBrowserSessionInfo(mode);
      this.switchBrowserSession(currentSessionInfo, {
        name: mode,
        tabs: freeSessionInfo?.tabs ?? [],
        lastModified: Date.now(),
      });
      setBadgeText(mode);
      return;
    }
    const nextSession = await this.getBrowserSessionInfo(activeTerminalWorkspace.name);
    if (!nextSession) {
      // 次のセッションがないときは新しく空のセッションを作る
      this.switchBrowserSession(currentSessionInfo, {
        name: activeTerminalWorkspace.name,
        tabs: [],
        lastModified: Date.now(),
      });
      setBadgeText(activeTerminalWorkspace.name);
      return;
    }
    if (currentSessionInfo.name !== nextSession.name) {
      console.log('switch session');
      this.switchBrowserSession(currentSessionInfo, nextSession);
      setBadgeText(nextSession.name);
    }
    if (currentSessionInfo.name === nextSession.name) {
      setBadgeText(currentSessionInfo.name);
    }
  };

  private switchBrowserSession = async (currentSession: Session, nextSession: Session) => {
    await this.saveBrowserSessionTabs(currentSession.name);
    const currentTabs = await browser.tabs.query({ pinned: false });
    // 次セッションのタブを作る
    await this.createTabs(nextSession.tabs);
    // 古いセッションのタブを消す
    await this.closeBrowserTabs(currentTabs);
    await this.saveBrowserCurrentSessionName(nextSession.name);
    setBadgeText(nextSession.name);
  };

  private createTabs = async (tabs: Tabs.Tab[]) => {
    if (tabs.length === 0) {
      await browser.tabs.create({ active: true });
    }
    for (const tab of tabs) {
      if (tab.url) {
        await browser.tabs.create({ url: tab.url, active: tab.active });
      } else {
        await browser.tabs.create({ active: tab.active, url: undefined });
      }
    }
  };

  private saveBrowserSession = async (session: Session) => {
    const key = `${SESSION_SAVE_PREFIX}-${session.name}`;
    await browser.storage.local.set({ [key]: session });
  };

  private saveBrowserCurrentSessionName = async (name: string) => {
    await browser.storage.local.set({ [CURRENT_SESSION_KEY]: name });
  };

  private saveBrowserSessionTabs = async (sessionName: string) => {
    const tabs = await browser.tabs.query({ pinned: false });
    const session: Session = {
      name: sessionName,
      tabs,
      lastModified: Date.now(),
    };
    await this.saveBrowserSession(session);
  };

  private closeBrowserTabs = async (tabs: Tabs.Tab[]) => {
    await browser.tabs.remove(tabs.map((tab) => tab.id as number));
  };

  private getBrowserCurrentSessionName = async (): Promise<string | undefined> => {
    const name = (await browser.storage.local.get(CURRENT_SESSION_KEY))[CURRENT_SESSION_KEY];
    return name;
  };

  private getBrowserCurrentSessionInfo = async () => {
    const name = await this.getBrowserCurrentSessionName();
    if (!name) return undefined;
    return await this.getBrowserSessionInfo(name);
  };

  private getBrowserSessionInfo = async (name: string): Promise<Session | undefined> => {
    const key = `${SESSION_SAVE_PREFIX}-${name}`;
    const session = (await browser.storage.local.get(key))[key];
    return (
      (session as Session) ?? {
        name,
        tabs: [],
        lastModified: Date.now(),
      }
    );
  };

  private switchMode = async () => {
    const mode = await this.getMode();
    await this.setMode(mode === 'FREE' ? 'MANAGED' : 'FREE');
    await this.checkSessionChange();
  };

  private getMode = async (): Promise<Mode> => {
    const mode = (await browser.storage.local.get(MODE_KEY))[MODE_KEY];
    return mode ?? 'MANAGED';
  };

  private setMode = async (mode: Mode) => {
    await browser.storage.local.set({ [MODE_KEY]: mode });
  };
}

interface Session {
  name: string;
  tabs: Tabs.Tab[];
  lastModified: number;
}

type Mode = 'FREE' | 'MANAGED';

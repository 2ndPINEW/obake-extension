import React, { ReactElement, useEffect } from 'react';
import browser from 'webextension-polyfill';

import { SESSION_RECHECK_MESSAGE_TYPE } from '../shared/constants/message';
import { Workspace } from '../shared/types/workspace';
import { getTerminalWorkspaceManagerInfo, switchTerminalWorkspace } from '../shared/utils/api';

import { Button } from './components/Button';

const Popup = (): ReactElement => {
  document.body.style.minWidth = '300px';
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);

  useEffect(() => {
    getTerminalWorkspaceManagerInfo().then((data) => {
      setWorkspaces(data.workspaces);
    });
  });

  const handleClick = (workspace: Workspace) => {
    switchTerminalWorkspace(workspace.id).then(() => {
      browser.runtime.sendMessage({ type: SESSION_RECHECK_MESSAGE_TYPE });
    });
  };

  return (
    <div className="p-2 overflow-auto">
      {workspaces.map((workspace) => (
        <div key={workspace.id}>
          <Button
            workspace={workspace}
            onClick={() => {
              handleClick(workspace);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Popup;

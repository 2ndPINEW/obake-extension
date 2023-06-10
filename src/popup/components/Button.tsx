import React from 'react';

import { Workspace } from '../../shared/types/workspace';

interface ButtonProps {
  workspace: Workspace;
  onClick: () => void;
}

export const Button = ({ workspace, onClick }: ButtonProps) => {
  const handleClick = () => {
    onClick();
  };
  return (
    <button
      style={{
        backgroundColor:
          workspace.status === 'ACTIVE'
            ? '#FB5824'
            : workspace.status === 'BACKGROUND'
            ? '#26c952'
            : '#727272',
      }}
      className="w-full text-left px-4 py-2 text-white font-bold rounded-lg my-0.5"
      onClick={handleClick}
    >
      {workspace.name}
    </button>
  );
};

import React, { ChangeEvent, useEffect, useState } from 'react';

import { readApiPort, writeApiPort } from '../shared/utils/apiPort';

const Options = () => {
  const [port, setPort] = useState(0);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPort(Number(event.target.value));
  };

  useEffect(() => {
    readApiPort().then((port) => {
      setPort(port);
    });
  }, []);

  const handleButtonClick = () => {
    writeApiPort(port);
  };

  return (
    <div className="h-screen flex justify-center align-middle">
      <div className="p-6 max-w-sm my-auto mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div className="flex-shrink-0">
          <h1 className="font-bold mb-4 text-2xl">Options</h1>
          <h2 className="mb-2 text-base">API PORT</h2>
          <input
            type="number"
            className="p-2 border rounded-md"
            value={port}
            onChange={handleInputChange}
          />
          <button
            className="mt-4 px-2 py-1 bg-blue-600 text-white rounded"
            onClick={handleButtonClick}
          >
            Save
          </button>
          <h2 className="mt-8 text-base">Shortcut</h2>
          <div>Please setting here.</div>
          <a href="chrome://extensions/shortcuts">chrome://extensions/shortcuts</a>
        </div>
      </div>
    </div>
  );
};

export default Options;

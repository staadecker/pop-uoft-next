/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import {useMemo, useState} from 'react';

import {isDevPlayground} from './appSettings';
import {useSettings} from './context/SettingsContext';
import Switch from './ui/Switch';

export default function Settings(): JSX.Element {
  const windowLocation = window.location;
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <button
        id="options-button"
        className={`editor-dev-button`}
        onClick={() => setShowSettings(!showSettings)}
      />
    </>
  );
}

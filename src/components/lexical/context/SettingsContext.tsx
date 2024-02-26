/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { SettingName } from "../appSettings";

import * as React from "react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { DEFAULT_SETTINGS } from "../appSettings";

type SettingsContextShape = {
  settings: Record<SettingName, boolean>;
};

const Context: React.Context<SettingsContextShape> = createContext({
  setOption: (name: SettingName, value: boolean) => {
    return;
  },
  settings: DEFAULT_SETTINGS,
});

export const SettingsContext = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const contextValue = useMemo(() => {
    return { settings };
  }, [settings]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useSettings = (): SettingsContextShape => {
  return useContext(Context);
};


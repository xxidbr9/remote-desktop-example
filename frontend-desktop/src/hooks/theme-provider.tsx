import React, { useMemo } from 'react';
import { DeviceThemeProvider, useDeviceTheme } from './dark-provider';
import type { UseDeviceThemeProps } from './dark-provider.d';

const ThemeContext = React.createContext<{
  dark: boolean;
  setTheme: UseDeviceThemeProps['setTheme'];
}>({
  dark: true,
  setTheme: () => { }
});

type ThemeProviderProps = {
  children: React.ReactNode;
  dark?: boolean;
};

const InnerProvider = (props: ThemeProviderProps) => {
  const { setTheme, resolvedTheme: deviceTheme } = useDeviceTheme();

  const isDark = useMemo(() => deviceTheme === 'dark', [deviceTheme]);
  return (
    <ThemeContext.Provider value={{ dark: isDark, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  )
}

const ThemeProvider = (props: ThemeProviderProps) => {

  return (
    <DeviceThemeProvider defaultTheme="system" attribute='class'>
      <InnerProvider {...props} />
    </DeviceThemeProvider>
  );
};

export { ThemeContext, ThemeProvider };

export default ThemeProvider;
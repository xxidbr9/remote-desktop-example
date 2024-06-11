import React from 'react';
import { ThemeContext } from './theme-provider';

export const useTheme = () => {
  const context = React.useContext(ThemeContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

// export default useTheme;
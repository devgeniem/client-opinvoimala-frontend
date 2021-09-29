import React, { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { StoreProvider } from '../store/storeContext';
import { rootStore } from '../store/RootStore';
import { theme, ThemeProvider } from '../theme';
import '../i18n';

function render(ui: ReactElement, { ...renderOptions }: any = {}) {
  const Wrapper: React.FC = ({ children }) => {
    return (
      <StoreProvider value={rootStore}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </StoreProvider>
    );
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };

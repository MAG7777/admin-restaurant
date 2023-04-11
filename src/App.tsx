import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { AppRouter } from 'components/AppRouter';
import { store } from 'store';
import './styles/index.less';
import { ScrollToTop } from 'components/ScrollToTop/ScrollToTop';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
        <ScrollToTop />
      </BrowserRouter>
    </Provider>
  );
};

export default App;

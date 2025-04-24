import { useEffect } from 'react';
import './App.css';
import Layout from '@/Layout/layout';
import { notify } from './hooks/toastUtils';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/hooks/toastUtils';
import store from '@/redux/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
          <Layout />
          <ToastProvider />
        </Provider>
      </BrowserRouter>
    </>
  );
}

export default App;

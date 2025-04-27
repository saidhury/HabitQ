// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles'; // <-- ADD BACK
import CssBaseline from '@mui/material/CssBaseline'; // <-- ADD BACK
import store from './store/slices/store.js'; // Ensure path is correct
import theme from './theme'; // <-- ADD BACK (Ensure path is correct)
import App from './App.jsx';
import './index.css'; // Keep this for non-MUI globals if any

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* ThemeProvider wraps App and provides the theme context */}
      <ThemeProvider theme={theme}>
        {/* CssBaseline applies resets and background based on theme */}
        <CssBaseline />
        <BrowserRouter>
          {/* App now receives the theme context from ThemeProvider */}
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
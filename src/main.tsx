import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './transitions.css';
import './panel-polish.css';
import './preset-studio.css';
import './preset-studio';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

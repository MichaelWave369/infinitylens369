import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './transitions.css';
import './panel-polish.css';
import './preset-studio.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('InfinityLens369 could not find the root element.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

window.setTimeout(() => {
  import('./preset-studio').catch((error) => {
    console.warn('InfinityLens369 Preset Studio failed to load. Core visualizer remains available.', error);
  });
}, 0);

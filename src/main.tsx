import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './transitions.css';
import './panel-polish.css';
import './preset-studio.css';
import './capture-studio.css';
import './recording-studio.css';
import './studio-dock.css';

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

window.setTimeout(() => {
  import('./capture-studio-loader').catch((error) => {
    console.warn('InfinityLens369 Capture Studio failed to load. Core visualizer remains available.', error);
  });
}, 100);

window.setTimeout(() => {
  import('./recording-studio-loader').catch((error) => {
    console.warn('InfinityLens369 Recording Studio failed to load. Core visualizer remains available.', error);
  });
}, 200);

window.setTimeout(() => {
  import('./version-sync').catch((error) => {
    console.warn('InfinityLens369 version sync failed to load. Core visualizer remains available.', error);
  });
}, 350);

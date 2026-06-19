import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './transitions.css';
import './panel-polish.css';
import './preset-studio.css';
import './capture-studio.css';
import './recording-studio.css';
import './performance-console.css';
import './layer-console.css';
import './launch-console.css';
import './gallery-console.css';
import './roadmap-console.css';
import './system-health-console.css';
import './accessibility-console.css';
import './showcase-console.css';
import './share-console.css';
import './launch-packet-console.css';
import './visual-cleanup.css';
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
  import('./performance-console-loader').catch((error) => {
    console.warn('InfinityLens369 Performance Console failed to load. Core visualizer remains available.', error);
  });
}, 300);

window.setTimeout(() => {
  import('./layer-console-loader').catch((error) => {
    console.warn('InfinityLens369 Layer Console failed to load. Core visualizer remains available.', error);
  });
}, 400);

window.setTimeout(() => {
  import('./launch-console-loader').catch((error) => {
    console.warn('InfinityLens369 Launch Console failed to load. Core visualizer remains available.', error);
  });
}, 500);

window.setTimeout(() => {
  import('./gallery-console-loader').catch((error) => {
    console.warn('InfinityLens369 Gallery Console failed to load. Core visualizer remains available.', error);
  });
}, 600);

window.setTimeout(() => {
  import('./roadmap-console-loader').catch((error) => {
    console.warn('InfinityLens369 Roadmap Console failed to load. Core visualizer remains available.', error);
  });
}, 700);

window.setTimeout(() => {
  import('./system-health-console-loader').catch((error) => {
    console.warn('InfinityLens369 System Health Console failed to load. Core visualizer remains available.', error);
  });
}, 800);

window.setTimeout(() => {
  import('./accessibility-console-loader').catch((error) => {
    console.warn('InfinityLens369 Accessibility Console failed to load. Core visualizer remains available.', error);
  });
}, 900);

window.setTimeout(() => {
  import('./showcase-console-loader').catch((error) => {
    console.warn('InfinityLens369 Showcase Console failed to load. Core visualizer remains available.', error);
  });
}, 1000);

window.setTimeout(() => {
  import('./share-console-loader').catch((error) => {
    console.warn('InfinityLens369 Share Console failed to load. Core visualizer remains available.', error);
  });
}, 1100);

window.setTimeout(() => {
  import('./launch-packet-console-loader').catch((error) => {
    console.warn('InfinityLens369 Launch Packet Console failed to load. Core visualizer remains available.', error);
  });
}, 1200);

window.setTimeout(() => {
  import('./visual-cleanup-loader').catch((error) => {
    console.warn('InfinityLens369 Visual Cleanup failed to load. Core visualizer remains available.', error);
  });
}, 1300);

window.setTimeout(() => {
  import('./version-sync').catch((error) => {
    console.warn('InfinityLens369 version sync failed to load. Core visualizer remains available.', error);
  });
}, 1500);

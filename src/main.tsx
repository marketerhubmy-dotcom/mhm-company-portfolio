import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './fonts';
import './styles/index.css';
import { App } from './App';

const container = document.getElementById('root')!;
const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages are hydrated; the dev server renders from scratch.
if (container.hasChildNodes()) hydrateRoot(container, tree);
else createRoot(container).render(tree);

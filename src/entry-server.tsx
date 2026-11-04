import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { HeadContext, renderHeadToString, type HeadData } from './components/Seo';
import { projects } from './features/portfolio/data';
import { site } from './config/site';

export { projects, site };

export function render(url: string) {
  let head: HeadData | null = null;
  const html = renderToString(
    <StrictMode>
      <HeadContext.Provider value={{ set: (d) => { head = d; } }}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>
    </StrictMode>,
  );
  if (!head) throw new Error(`Halaman ${url} tiada <Seo>`);
  return { html, head: renderHeadToString(head), noindex: (head as HeadData).noindex === true };
}

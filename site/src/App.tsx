import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastProvider, useAccessibilityPrefs } from "@cubo-tecnologia/hexagon";
import { Header, Footer } from "./Shell";
import { Home } from "./pages/Home";
import { DocsLayout } from "./pages/DocsLayout";
import { DocPage } from "./pages/DocPage";
import { NotFound } from "./pages/NotFound";
import { CommandSearch, useSearchShortcut } from "./CommandSearch";
import { PaginaCartaoSus } from "./lab/PaginaCartaoSus";

export function App() {
  const [prefs, setPrefs] = useAccessibilityPrefs();
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  useSearchShortcut(openSearch);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="hx-root s-app">
      <ToastProvider>
      <a className="s-skip" href="#conteudo">Pular para o conteúdo</a>
      <Header prefs={prefs} onPrefsChange={setPrefs} onSearch={openSearch} />
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocPage slug="introducao" />} />
          <Route path=":slug" element={<DocPage />} />
          <Route path="componentes/:slug" element={<DocPage />} />
        </Route>
        <Route path="/lab/assistente" element={<PaginaCartaoSus />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      </ToastProvider>
    </div>
  );
}

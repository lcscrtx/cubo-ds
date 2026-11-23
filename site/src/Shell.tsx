import { Link, NavLink } from "react-router-dom";
import { SearchButton } from "./CommandSearch";
import { AccessibilityBar, type AccessibilityPrefs } from "@cubo-tecnologia/hexagon";
import { AssistenteBotoes } from "./lab/Assistente";
import "./lab/lab.css";

/** Marca do Hexagon: seis blocos formando um hexágono (arquivo oficial em public/brand/hexagon.svg). */
export function Mark({ className = "s-mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 37.759 37.504" aria-hidden="true">
      <path d="M13.833 0 L23.926 0 L23.926 10.094 L13.833 10.094 Z" />
      <path d="M23.926 37.504 L13.833 37.504 L13.833 27.411 L23.926 27.411 Z" />
      <path d="M0 13.597 L5.155 4.919 L13.833 10.074 L8.678 18.752 Z" />
      <path d="M37.759 23.907 L32.604 32.585 L23.926 27.43 L29.082 18.752 Z" />
      <path d="M0 23.907 L5.155 32.585 L13.833 27.43 L8.678 18.752 Z" />
      <path d="M37.759 13.597 L32.604 4.919 L23.926 10.074 L29.082 18.752 Z" />
    </svg>
  );
}

export function Header({ prefs, onPrefsChange, onSearch }: { prefs: AccessibilityPrefs; onPrefsChange: (p: AccessibilityPrefs) => void; onSearch: () => void }) {
  return (
    <>
      {/* A barra do próprio Hexagon (AccessibilityBar). */}
      <AccessibilityBar prefs={prefs} onChange={onPrefsChange} policyHref="/docs/acessibilidade" policyLabel="Nosso compromisso">
        {/* Assistente de compreensão (protótipo): explica e simplifica a página aberta. */}
        <AssistenteBotoes />
      </AccessibilityBar>
      <header className="s-header">
        <div className="s-header__in">
          <Link to="/" className="s-logo" aria-label="Hexagon, início">
            <Mark />
            <span>Hexagon</span>
          </Link>
          <nav className="s-nav" aria-label="Principal">
            <NavLink to="/docs" end>Documentação</NavLink>
            <NavLink to="/docs/componentes">Componentes</NavLink>
            <NavLink to="/docs/fundacao">Fundação</NavLink>
            <NavLink to="/docs/acessibilidade">Acessibilidade</NavLink>
          </nav>
          <div className="s-header__end">
            <SearchButton onOpen={onSearch} />
            <button
              type="button"
              className="s-icon-btn"
              aria-label="Tema escuro"
              aria-pressed={prefs.theme === "dark"}
              onClick={() => onPrefsChange({ ...prefs, theme: prefs.theme === "dark" ? "light" : "dark" })}
            >
              {prefs.theme === "dark" ? (
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3" /><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="s-footer">
      <div className="s-footer__in">
        <div className="s-footer__about">
          <Link to="/" className="s-logo"><Mark /><span>Hexagon</span></Link>
          <p>O design system acessível da Cubo Tecnologia e dos seus produtos. Feito para o serviço público.</p>
          <p className="s-muted">Segue WCAG 2.2 nível AA, eMAG 3.1, ABNT NBR 17225 e a Lei Brasileira de Inclusão.</p>
        </div>
        <div className="s-footer__col">
          <p className="s-overline">Documentação</p>
          <Link to="/docs">Introdução</Link>
          <Link to="/docs/acessibilidade">Acessibilidade</Link>
          <Link to="/docs/instalacao">Instalação</Link>
          <Link to="/docs/fundacao">Fundação</Link>
          <Link to="/docs/componentes">Componentes</Link>
        </div>
      </div>
    </footer>
  );
}

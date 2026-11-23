export interface NavItem {
  slug: string;
  title: string;
  /** Caminho completo da página. */
  to: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

const secao = (slug: string, title: string): NavItem => ({ slug, title, to: slug === "introducao" ? "/docs" : `/docs/${slug}` });
const comp = (slug: string, title: string): NavItem => ({ slug, title, to: `/docs/componentes/${slug}` });

export const NAV: NavGroup[] = [
  {
    title: "Seções",
    items: [
      secao("introducao", "Introdução"),
      secao("acessibilidade", "Acessibilidade"),
      secao("instalacao", "Instalação"),
      secao("fundacao", "Fundação"),
      secao("componentes", "Componentes"),
    ],
  },
  // Componentes agrupados por tipo. As ondas em que foram feitos ficam registradas no README.
  {
    title: "Ações",
    items: [comp("button", "Button"), comp("icon-button", "IconButton e Tooltip"), comp("link", "Link"), comp("menu", "Menu")],
  },
  {
    title: "Navegação",
    items: [comp("breadcrumb", "Breadcrumb"), comp("tabs", "Tabs"), comp("pagination", "Pagination"), comp("stepper", "Stepper")],
  },
  {
    title: "Campos",
    items: [
      comp("text-field", "TextField"), comp("textarea", "Textarea"), comp("masked-field", "MaskedField"), comp("date-field", "DateField"),
      comp("select", "Select"), comp("combobox", "Combobox"), comp("checkbox", "Checkbox"), comp("radio-group", "RadioGroup"),
      comp("switch", "Switch"), comp("file-upload", "FileUpload"), comp("search-field", "SearchField"),
    ],
  },
  {
    title: "Feedback e estado",
    items: [comp("alert", "Alert"), comp("toast", "Toast"), comp("badge", "Badge"), comp("progress", "Progress"), comp("skeleton", "Skeleton"), comp("empty-state", "EmptyState")],
  },
  {
    title: "Sobreposições",
    items: [comp("dialog", "Dialog"), comp("drawer", "Drawer"), comp("popover", "Popover")],
  },
  {
    title: "Estrutura e conteúdo",
    items: [comp("page-header", "PageHeader"), comp("card", "Card"), comp("heading", "Heading e Eyebrow"), comp("accordion", "Accordion"), comp("description-list", "DescriptionList"), comp("timeline", "Timeline")],
  },
  {
    title: "Dados",
    items: [comp("table", "Table"), comp("stat", "Stat"), comp("tag-filter", "Tag e FilterChip"), comp("avatar", "Avatar")],
  },
  {
    title: "Acessibilidade",
    items: [comp("accessibility-bar", "AccessibilityBar")],
  },
];

export const FLAT_NAV: NavItem[] = NAV.flatMap((g) => g.items);
export const COMPONENT_GROUPS = NAV.slice(1);

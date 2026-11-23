# @cubo-tecnologia/hexagon

Design system da Cubo Tecnologia.
Componentes React e tokens em CSS/JSON, com **acessibilidade como núcleo**: WCAG 2.2 AA como piso (AAA em alvo de toque e movimento), eMAG 3.1, ABNT NBR 17225 e Lei Brasileira de Inclusão. Um modelo só, o do Cidade Conectada, em **IBM Plex Sans**. Outro produto adapta sobrescrevendo os tokens.

> Em construção. Os componentes entram por ondas e só são publicados no npm depois de aprovados.

## Desenvolvimento

```sh
npm install
npm run dev        # site de documentação em http://localhost:5700
npm run typecheck
```

- `tokens/tokens.mjs`: fonte única dos tokens (`base`, `theme` e `dark`).
- `src/components/`: um `.tsx` e um `.css` por componente, classes com prefixo `hx-`.
- `native/`: pacote React Native (`@cubo-tecnologia/hexagon-native`), com os mesmos tokens. Documentação em `/docs/mobile`.
- `site/`: site de documentação. Usa o código de `src/` direto, sem build.

## Uso (quando publicado)

```tsx
import "@cubo-tecnologia/hexagon/styles.css";
import { Button } from "@cubo-tecnologia/hexagon";

<div className="hx-root">
  <Button>Agendar demonstração</Button>
</div>
```

Para adaptar a outro produto, sobrescreva os tokens depois do CSS:

```css
:root {
  --hx-color-action: #1552e1;
  --hx-radius-control: 6px;
}
```

## Mobile (React Native)

Piloto com 13 componentes: Button, IconButton, ScreenHeader, BottomNav, TextField, Select, Checkbox, Switch, Alert, Badge, Card, ListItem e BottomSheet.
O tema nativo é gerado de `tokens/tokens.mjs`. Falta conferir em aparelho, com TalkBack e VoiceOver.

```tsx
import { Button, HexagonProvider } from "@cubo-tecnologia/hexagon-native";

<HexagonProvider>
  <Button onPress={enviar}>Enviar solicitação</Button>
</HexagonProvider>
```

## Ondas

| Onda | Componentes | Situação |
|---|---|---|
| 1 | Button, Badge (com ícones de status), Card, Heading/Eyebrow, TextField | Aprovada |
| 2 | Textarea, Select, Checkbox, RadioGroup, Alert | Aprovada |
| 3 | Link, Breadcrumb, Tabs, Dialog, Table | Aprovada |
| 4 | Toast, Skeleton, EmptyState, Pagination, SearchField | Aprovada |
| 5 | Accordion, Stepper, FileUpload, Switch, IconButton e Tooltip | Aprovada |
| 6 | MaskedField, DateField, Menu, Avatar, Progress | Aprovada |
| 7 | PageHeader, DescriptionList, Timeline, Combobox | Aprovada |
| 8 | Drawer, Popover, Tag e FilterChip, Stat, AccessibilityBar | Aprovada |
| — | Acabamento: sidebar por tipo, testes com axe, modo escuro, publicação no npm | Planejado |

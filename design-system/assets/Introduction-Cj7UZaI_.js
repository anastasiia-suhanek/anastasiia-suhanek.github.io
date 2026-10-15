import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{i as n,r}from"./react-DITjJg24.js";import{a as i,o as a}from"./blocks-BHMVNb04.js";function o(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Introduction`}),`
`,(0,c.jsx)(t.h1,{id:`design-system-sample`,children:`Design system sample`}),`
`,(0,c.jsxs)(t.p,{children:[`Components I built in the design system of a fintech app for international money transfers – iOS, Android and web.
`,(0,c.jsx)(t.strong,{children:`Anonymised under NDA:`}),` the brand colour, names and copy are replaced; the structure, properties and tokens follow production`]}),`
`,(0,c.jsx)(t.p,{children:`Designed in Figma, then rebuilt here in React and TypeScript with Claude Code – the same names and states in both, so design and code speak one language`}),`
`,(0,c.jsx)(t.h2,{id:`how-its-built`,children:`How it’s built`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Tokens in two layers.`}),` Primitives hold raw values; components use only semantic tokens (`,(0,c.jsx)(t.code,{children:`button/primary/bg`}),`, `,(0,c.jsx)(t.code,{children:`text/secondary`}),`), so a brand or a theme changes in one place. `,(0,c.jsx)(t.code,{children:`tokens.json`}),` is the source of truth, `,(0,c.jsx)(t.code,{children:`npm run tokens`}),` generates the CSS variables`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Components`}),` – Button, Bottom sheet, Full screen message, List item. Every prop maps to a component property in Figma`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Accessibility`}),` is checked on every story with axe (the Accessibility tab): semantic buttons and dialogs, focus rings, labels for icon-only buttons, reduced motion`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Readable by AI agents`}),` – the Storybook MCP addon exposes components and their docs to coding agents`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`links`,children:`Links`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:(0,c.jsx)(t.a,{href:`https://www.figma.com/design/d8WTz9z1dh04l7Nm8dcRvG/Anastasiia-Sukhanek-%E2%80%94-Design-System-Sample`,rel:`nofollow`,children:`Figma sample`})}),`
`,(0,c.jsx)(t.li,{children:(0,c.jsx)(t.a,{href:`https://anastasiia-suhanek.github.io`,rel:`nofollow`,children:`Portfolio`})}),`
`,(0,c.jsx)(t.li,{children:`Anastasiia Sukhanek, product designer`}),`
`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=t(),r(),a()})))()}l();export{s as default};
import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{i as r,r as i}from"./Icon-DWgkFGqC.js";import{n as a,t as o}from"./Button-CvTfOxGd.js";var s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{s=t(),a(),r(),c=n(),l={title:`Components/Button`,component:o,tags:[`autodocs`],args:{children:`Continue`,variant:`primary`},render:(e,{globals:t,parameters:n})=>(0,c.jsx)(o,{...e,...t.locale===`ru`?n.ru:{}}),argTypes:{icon:{control:`select`,options:[void 0,...i]}},parameters:{ru:{children:`Продолжить`},docs:{description:{component:`Three types by emphasis and four states. **One Primary per screen**; Secondary is an alternative next to it; Ghost is a low-emphasis action like "Learn more". Loading keeps the width so the layout doesn’t jump`}}}},u={},d={args:{variant:`secondary`,children:`Change amount`},parameters:{ru:{children:`Изменить сумму`}}},f={args:{variant:`ghost`,children:`Learn more`},parameters:{ru:{children:`Подробнее`}}},p={args:{icon:`arrow-forward`}},m={args:{loading:!0}},h={args:{disabled:!0}},g={parameters:{layout:`padded`},render:(e,{globals:t})=>{let n=t.locale===`ru`?[`Обычная`,`Нажата`,`Неактивна`,`Загрузка`]:[`Default`,`Pressed`,`Disabled`,`Loading`];return(0,c.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(4, 220px)`,gap:24,alignItems:`center`},children:[`primary`,`secondary`,`ghost`].map(e=>(0,c.jsxs)(s.Fragment,{children:[(0,c.jsx)(o,{variant:e,fullWidth:!0,children:n[0]}),(0,c.jsx)(o,{variant:e,fullWidth:!0,pressed:!0,children:n[1]}),(0,c.jsx)(o,{variant:e,fullWidth:!0,disabled:!0,children:n[2]}),(0,c.jsx)(o,{variant:e,fullWidth:!0,loading:!0,children:n[3]})]},e))})}},_=[`Primary`,`Secondary`,`Ghost`,`WithIcon`,`Loading`,`Disabled`,`Matrix`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Change amount'
  },
  parameters: {
    ru: {
      children: 'Изменить сумму'
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    children: 'Learn more'
  },
  parameters: {
    ru: {
      children: 'Подробнее'
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    icon: 'arrow-forward'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'padded'
  },
  render: (_, {
    globals
  }) => {
    const ru = globals.locale === 'ru';
    const l = ru ? ['Обычная', 'Нажата', 'Неактивна', 'Загрузка'] : ['Default', 'Pressed', 'Disabled', 'Loading'];
    return <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 220px)',
      gap: 24,
      alignItems: 'center'
    }}>
      {(['primary', 'secondary', 'ghost'] as const).map(v => <Fragment key={v}>
          <Button variant={v} fullWidth>{l[0]}</Button>
          <Button variant={v} fullWidth pressed>{l[1]}</Button>
          <Button variant={v} fullWidth disabled>{l[2]}</Button>
          <Button variant={v} fullWidth loading>{l[3]}</Button>
        </Fragment>)}
    </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`Every type in every state – the same matrix as in Figma`,...g.parameters?.docs?.description}}}})))()}v();export{h as Disabled,f as Ghost,m as Loading,g as Matrix,u as Primary,d as Secondary,p as WithIcon,_ as __namedExportsOrder,l as default};
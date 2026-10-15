import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{o as t,s as n}from"./iframe-CWJ52iR5.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{n(),r={title:`Components/Bottom sheet`,component:t,tags:[`autodocs`],args:{type:`message`,title:`Today’s limit reached`,subtitle:`Verify your identity to send more today. It takes about 3 minutes`,illustration:`cat`,closable:!0,actions:{primary:`Verify now`}},argTypes:{illustration:{control:`select`,options:[`cat`,`money`,null]}},parameters:{docs:{description:{component:`A message or a decision that keeps the user on the current screen. Say what happened in the title and what to do in the subtitle, with **one primary action**. Use Closable when the message can wait; turn it off only when there is a way forward in the buttons`}}}},i={},a={args:{actions:{primary:`Verify now`,secondary:`Change amount`}}},o={args:{closable:!1,title:`Let’s update your docs`,subtitle:`Your documents have expired. Update them to keep sending money`,illustration:`money`,actions:{primary:`Open bot`,ghost:`All clear`}}},s={args:{type:`functional`,title:`Check your email`,subtitle:`We sent a request for extra documents. Reply to it to keep sending`,actions:{primary:`Open email`,secondary:`Not now`}}},c={args:{actions:{primary:`Verify now`,primaryLoading:!0}}},l=[`Message`,`TwoActions`,`NotClosable`,`Functional`,`Loading`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    actions: {
      primary: 'Verify now',
      secondary: 'Change amount'
    }
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    closable: false,
    title: 'Let’s update your docs',
    subtitle: 'Your documents have expired. Update them to keep sending money',
    illustration: 'money',
    actions: {
      primary: 'Open bot',
      ghost: 'All clear'
    }
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'functional',
    title: 'Check your email',
    subtitle: 'We sent a request for extra documents. Reply to it to keep sending',
    actions: {
      primary: 'Open email',
      secondary: 'Not now'
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    actions: {
      primary: 'Verify now',
      primaryLoading: true
    }
  }
}`,...c.parameters?.docs?.source}}}})))()}u();export{s as Functional,c as Loading,i as Message,o as NotClosable,a as TwoActions,l as __namedExportsOrder,r as default};
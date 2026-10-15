import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{E as n,T as r}from"./iframe-BPMLu3E0.js";var i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),i=t(),a={title:`Components/Bottom sheet`,component:r,tags:[`autodocs`],args:{type:`message`,title:`Today’s limit reached`,subtitle:`Verify your identity to send more today. It takes about 3 minutes`,illustration:`cat`,closable:!0,actions:{primary:`Verify now`}},render:(e,{globals:t,parameters:n})=>(0,i.jsx)(r,{...e,...t.locale===`ru`?{closeLabel:`Закрыть`,...n.ru}:{}}),argTypes:{illustration:{control:`select`,options:[`cat`,`money`,null]}},parameters:{ru:{title:`Дневной лимит исчерпан`,subtitle:`Пройдите верификацию, чтобы отправить больше сегодня. Это займёт около 3 минут`,actions:{primary:`Пройти верификацию`}},docs:{description:{component:`A message or a decision that keeps the user on the current screen. Say what happened in the title and what to do in the subtitle, with **one primary action**. Use Closable when the message can wait; turn it off only when there is a way forward in the buttons`}}}},o={},s={args:{actions:{primary:`Verify now`,secondary:`Change amount`}},parameters:{ru:{title:`Дневной лимит исчерпан`,subtitle:`Пройдите верификацию, чтобы отправить больше сегодня. Это займёт около 3 минут`,actions:{primary:`Пройти верификацию`,secondary:`Изменить сумму`}}}},c={args:{closable:!1,title:`Let’s update your docs`,subtitle:`Your documents have expired. Update them to keep sending money`,illustration:`money`,actions:{primary:`Open bot`,ghost:`All clear`}},parameters:{ru:{title:`Пора обновить документы`,subtitle:`Срок действия документов истёк. Обновите их, чтобы продолжить переводы`,actions:{primary:`Открыть бота`,ghost:`Понятно`}}}},l={args:{type:`functional`,title:`Check your email`,subtitle:`We sent a request for extra documents. Reply to it to keep sending`,actions:{primary:`Open email`,secondary:`Not now`}},parameters:{ru:{title:`Проверьте почту`,subtitle:`Мы отправили запрос на дополнительные документы. Ответьте на него, чтобы продолжить переводы`,actions:{primary:`Открыть почту`,secondary:`Не сейчас`}}}},u={args:{actions:{primary:`Verify now`,primaryLoading:!0}},parameters:{ru:{title:`Дневной лимит исчерпан`,subtitle:`Пройдите верификацию, чтобы отправить больше сегодня. Это займёт около 3 минут`,actions:{primary:`Пройти верификацию`,primaryLoading:!0}}}},d=[`Message`,`TwoActions`,`NotClosable`,`Functional`,`Loading`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    actions: {
      primary: 'Verify now',
      secondary: 'Change amount'
    }
  },
  parameters: {
    ru: {
      title: 'Дневной лимит исчерпан',
      subtitle: 'Пройдите верификацию, чтобы отправить больше сегодня. Это займёт около 3 минут',
      actions: {
        primary: 'Пройти верификацию',
        secondary: 'Изменить сумму'
      }
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    closable: false,
    title: 'Let’s update your docs',
    subtitle: 'Your documents have expired. Update them to keep sending money',
    illustration: 'money',
    actions: {
      primary: 'Open bot',
      ghost: 'All clear'
    }
  },
  parameters: {
    ru: {
      title: 'Пора обновить документы',
      subtitle: 'Срок действия документов истёк. Обновите их, чтобы продолжить переводы',
      actions: {
        primary: 'Открыть бота',
        ghost: 'Понятно'
      }
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'functional',
    title: 'Check your email',
    subtitle: 'We sent a request for extra documents. Reply to it to keep sending',
    actions: {
      primary: 'Open email',
      secondary: 'Not now'
    }
  },
  parameters: {
    ru: {
      title: 'Проверьте почту',
      subtitle: 'Мы отправили запрос на дополнительные документы. Ответьте на него, чтобы продолжить переводы',
      actions: {
        primary: 'Открыть почту',
        secondary: 'Не сейчас'
      }
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    actions: {
      primary: 'Verify now',
      primaryLoading: true
    }
  },
  parameters: {
    ru: {
      title: 'Дневной лимит исчерпан',
      subtitle: 'Пройдите верификацию, чтобы отправить больше сегодня. Это займёт около 3 минут',
      actions: {
        primary: 'Пройти верификацию',
        primaryLoading: true
      }
    }
  }
}`,...u.parameters?.docs?.source}}}})))()}f();export{l as Functional,u as Loading,o as Message,c as NotClosable,s as TwoActions,d as __namedExportsOrder,a as default};
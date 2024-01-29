import htmlBanUserMessage from './html/banUserMessage';
const templatesEmail = Object.freeze({
  BAN_USER_MESSAGE: {
    BODY: (nameUser: string, titleContent: string, imageContent: string) =>
      htmlBanUserMessage(nameUser, titleContent, imageContent),
    TITLE: 'Comunicado Importante - Suporte Vyppers',
  },
});

export { templatesEmail };

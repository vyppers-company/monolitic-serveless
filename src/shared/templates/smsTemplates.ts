const templatesSMS = Object.freeze({
  BAN_USER_MESSAGE: {
    BODY: (nameUser: string, titleContent: string, imageContent: string) =>
      `${nameUser} bloqueamos seu acesso devido a denuncia relacionado ao conteudo: title:${titleContent}, image:${imageContent}`,
  },
});

export { templatesSMS };

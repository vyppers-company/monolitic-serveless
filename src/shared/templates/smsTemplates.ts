const templatesSMS = Object.freeze({
  REGISTER_USER: {
    BODY: (code: string) =>
      `Bem vindo a vyppers! A maior plataforma de conteudo pago do brasil, este é seu codigo de cadastro ${code} por favor não compartilhe com ninguém, este código é de uso único`,
  },
  BAN_USER_MESSAGE: {
    BODY: (nameUser: string, titleContent: string, imageContent: string) =>
      `${nameUser} bloqueamos seu acesso devido a denuncia relacionado ao conteudo: title:${titleContent}, image:${imageContent}`,
  },
});

export { templatesSMS };

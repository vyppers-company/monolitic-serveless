export default (
  nameUser: string,
  titleContent: string,
  imageContent: string,
) => {
  return `${nameUser} bloqueamos seu acesso devido a denuncia relacionado ao conteudo: title:${titleContent}, image:${imageContent}`;
};

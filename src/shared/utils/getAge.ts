const getAge = (date: string) => {
  const born = new Date(date);
  const now = new Date();
  // Obtém o ano de nascimento
  const bornYear = born.getFullYear();
  const nowYear = now.getFullYear();

  let age = nowYear - bornYear;

  const mBorn = born.getMonth();
  const dBorn = born.getDate();
  const mNow = now.getMonth();
  const dNow = now.getDate();

  if (mNow < mBorn || (mNow === mNow && dNow < dBorn)) {
    age--;
  }
  return age < 15 ? false : true;
};

export { getAge };

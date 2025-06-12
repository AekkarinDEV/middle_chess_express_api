export const GennerateUDI = () => {
  return Math.random().toString(16).substring(2) + Date.now().toString(16);
};

export const getTodayFormatted = () => {
  const today = new Date();
  return `${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getDate().toString().padStart(2, "0")}`;
};

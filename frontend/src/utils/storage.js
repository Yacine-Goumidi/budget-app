// Sauvegarder les listes dans le LocalStorage
export const saveLists = (lists) => {
  localStorage.setItem('budgetAppLists', JSON.stringify(lists));
};

// Charger les listes depuis le LocalStorage
export const loadLists = () => {
  const data = localStorage.getItem('budgetAppLists');
  return data ? JSON.parse(data) : [];
};

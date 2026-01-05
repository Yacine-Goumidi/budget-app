import React, { createContext, useState, useEffect } from 'react';
import { saveLists, loadLists } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  // Etat de la liste active
  const [budget, setBudget] = useState(0);
  const [products, setProducts] = useState([]);

  // Toutes les listes sauvegardées
  const [lists, setLists] = useState(loadLists());

  // ID de la liste actuellement active
  const [activeListId, setActiveListId] = useState(null);

  // Sauvegarde automatique dans le LocalStorage à chaque modification des listes
  useEffect(() => {
    saveLists(lists);
  }, [lists]);

  // Ajouter une nouvelle liste
  const addList = (name, budgetValue, productsArray) => {
    const newList = {
      id: uuidv4(),
      name: name || `Liste ${lists.length + 1}`,
      date: new Date().toISOString(),
      budget: budgetValue,
      total: productsArray.reduce((acc, p) => acc + p.price * p.quantity, 0),
      products: productsArray,
      status: 'active', // ou 'terminée'
    };
    setLists([newList, ...lists]);
    setActiveListId(newList.id);
  };

  // Supprimer une liste de l'historique
  const removeList = (id) => {
    setLists(lists.filter(list => list.id !== id));
    if (activeListId === id) setActiveListId(null);
  };

  // Charger une liste depuis l'historique
  const loadList = (id) => {
    const list = lists.find(l => l.id === id);
    if (list) {
      setActiveListId(list.id);
      setBudget(list.budget);
      setProducts(list.products);
    }
  };

  // Mettre à jour une liste existante (ex: modifier nom, budget, produits)
  const updateList = (id, updatedFields) => {
    setLists(
      lists.map(list =>
        list.id === id ? { ...list, ...updatedFields, total: updatedFields.products ? updatedFields.products.reduce((acc, p) => acc + p.price * p.quantity, 0) : list.total } : list
      )
    );
    if (activeListId === id) {
      if (updatedFields.budget !== undefined) setBudget(updatedFields.budget);
      if (updatedFields.products !== undefined) setProducts(updatedFields.products);
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        budget,
        setBudget,
        products,
        setProducts,
        lists,
        activeListId,
        addList,
        removeList,
        loadList,
        updateList,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

import React, { createContext, useState } from 'react';

export const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [budget, setBudget] = useState(0);
  const [products, setProducts] = useState([]);

  return (
    <BudgetContext.Provider value={{ budget, setBudget, products, setProducts }}>
      {children}
    </BudgetContext.Provider>
  );
}

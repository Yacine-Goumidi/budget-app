import React, { useContext } from 'react';
import { BudgetContext } from '../context/BudgetContext';

export default function History() {
  const { lists, loadList, removeList } = useContext(BudgetContext);

  if (lists.length === 0) return <p>Aucune liste sauvegardée.</p>;

  return (
    <div>
      <h1>Historique des listes</h1>
      {lists.map(list => (
        <div key={list.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{list.name}</h3>
          <p>Date : {new Date(list.date).toLocaleString()}</p>
          <p>Budget : {list.budget}€</p>
          <p>Total dépensé : {list.total}€</p>
          <button onClick={() => loadList(list.id)}>Charger</button>
          <button onClick={() => removeList(list.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}

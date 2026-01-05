import React, { useContext, useState } from 'react';
import { BudgetContext } from '../context/BudgetContext';

export default function History() {
  const { lists, removeList, loadList } = useContext(BudgetContext);
  const [sortField, setSortField] = useState('date'); // date, budget, total
  const [sortOrder, setSortOrder] = useState('desc'); // asc ou desc

  // Fonction pour trier les listes
  const sortedLists = [...lists].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'date') {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="history-page p-4">
      <h1 className="text-2xl font-bold mb-4">Historique des listes</h1>
      {lists.length === 0 ? (
        <p>Aucune liste sauvegardée pour l'instant.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th
                className="cursor-pointer p-2 border"
                onClick={() => handleSort('name')}
              >
                Nom
              </th>
              <th
                className="cursor-pointer p-2 border"
                onClick={() => handleSort('date')}
              >
                Date
              </th>
              <th
                className="cursor-pointer p-2 border"
                onClick={() => handleSort('budget')}
              >
                Budget
              </th>
              <th
                className="cursor-pointer p-2 border"
                onClick={() => handleSort('total')}
              >
                Total dépensé
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedLists.map((list) => (
              <tr key={list.id} className="text-center">
                <td className="p-2 border">{list.name}</td>
                <td className="p-2 border">{new Date(list.date).toLocaleString()}</td>
                <td className="p-2 border">{list.budget} €</td>
                <td className="p-2 border">{list.total} €</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    onClick={() => loadList(list.id)}
                  >
                    Charger
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => {
                      if (window.confirm('Supprimer cette liste ?')) removeList(list.id);
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

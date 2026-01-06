import React, { useEffect, useState } from 'react';
import { loadLists, saveLists } from '../utils/storage';
import { generatePDF } from '../utils/pdf';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  // Charger les listes
  useEffect(() => {
    setLists(loadLists());
  }, []);

  // Supprimer une liste
  const deleteList = (id) => {
    const updated = lists.filter(list => list.id !== id);
    setLists(updated);
    saveLists(updated);
  };

  // Supprimer tout l’historique
  const deleteAllLists = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tout l’historique ?')) {
      setLists([]);
      saveLists([]);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Historique des listes</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 w-full sm:w-auto"
          >
            Retour au Dashboard
          </button>
          {lists.length > 0 && (
            <button
              onClick={deleteAllLists}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full sm:w-auto"
            >
              Supprimer tout l’historique
            </button>
          )}
        </div>
      </div>

      {/* Listes */}
      {lists.length === 0 ? (
        <p>Aucune liste sauvegardée</p>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="border rounded p-4 shadow-sm bg-white flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center"
            >
              {/* Infos Liste */}
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold">{list.name}</h2>
                <p className="text-sm text-gray-500">{new Date(list.date).toLocaleString()}</p>
                <p>Budget : {list.budget.toFixed(2)} €</p>
                <p>Total dépensé : {list.totalSpent.toFixed(2)} €</p>
                <p className={`font-semibold ${list.totalSpent > list.budget ? 'text-red-600' : 'text-green-600'}`}>
                  {list.totalSpent > list.budget ? 'Budget dépassé' : 'Budget respecté'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => generatePDF(list.products, list.totalSpent, list.budget, list.name)}
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => deleteList(list.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

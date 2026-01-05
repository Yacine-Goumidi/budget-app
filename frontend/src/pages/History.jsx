import React, { useEffect, useState } from 'react';
import { loadLists, saveLists } from '../utils/storage';
import { generatePDF } from '../utils/pdf';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  /* ===================== LOAD LISTS ===================== */
  useEffect(() => {
    setLists(loadLists());
  }, []);

  /* ===================== SUPPRIMER UNE LISTE ===================== */
  const deleteList = (id) => {
    const updatedLists = lists.filter(list => list.id !== id);
    setLists(updatedLists);
    saveLists(updatedLists);
  };

  /* ===================== SUPPRIMER TOUT L’HISTORIQUE ===================== */
  const deleteAllLists = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tout l’historique ?')) {
      setLists([]);
      saveLists([]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Historique des listes</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Retour au Dashboard
          </button>

          {lists.length > 0 && (
            <button
              onClick={deleteAllLists}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Supprimer tout l’historique
            </button>
          )}
        </div>
      </div>

      {lists.length === 0 ? (
        <p>Aucune liste sauvegardée</p>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="border rounded p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="font-semibold">{list.name}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(list.date).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      generatePDF(
                        list.products,
                        list.totalSpent,
                        list.budget,
                        list.name
                      )
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Export PDF
                  </button>

                  <button
                    onClick={() => deleteList(list.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="text-sm">
                <p>Budget : {list.budget.toFixed(2)} €</p>
                <p>Total dépensé : {list.totalSpent.toFixed(2)} €</p>
                <p
                  className={`font-semibold ${
                    list.totalSpent > list.budget
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {list.totalSpent > list.budget
                    ? 'Budget dépassé'
                    : 'Budget respecté'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BudgetContext } from '../context/BudgetContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { budget, setBudget, products, setProducts } = useContext(BudgetContext);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: 1,
    category: '',
  });

  // Fonction pour ajouter un produit à la liste
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;

    const productToAdd = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
      id: Date.now(),
    };

    setProducts([...products, productToAdd]);
    setNewProduct({ name: '', price: '', quantity: 1, category: '' });
  };

  // Calcul du total des dépenses
  const totalSpent = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  return (
    <div className="dashboard-page p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>

      {/* Bouton Historique */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        onClick={() => navigate('/history')}
      >
        Historique
      </button>

      {/* Section Budget */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Budget :</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value))}
          className="border px-2 py-1 rounded w-32"
        />
        <p className="mt-2">
          Total dépensé : {totalSpent} / Budget : {budget}
        </p>
      </div>

      {/* Formulaire ajout produit */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Ajouter un produit</h2>
        <input
          type="text"
          placeholder="Nom du produit"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border px-2 py-1 rounded mr-2"
        />
        <input
          type="number"
          placeholder="Prix"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="border px-2 py-1 rounded mr-2 w-20"
        />
        <input
          type="number"
          placeholder="Quantité"
          value={newProduct.quantity}
          onChange={(e) =>
            setNewProduct({ ...newProduct, quantity: e.target.value })
          }
          className="border px-2 py-1 rounded mr-2 w-20"
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="border px-2 py-1 rounded mr-2 w-32"
        />
        <button
          onClick={addProduct}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des produits */}
      <div>
        <h2 className="font-semibold mb-2">Liste des produits</h2>
        {products.length === 0 ? (
          <p>Aucun produit ajouté</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1">Nom</th>
                <th className="border px-2 py-1">Prix</th>
                <th className="border px-2 py-1">Quantité</th>
                <th className="border px-2 py-1">Catégorie</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border px-2 py-1">{product.name}</td>
                  <td className="border px-2 py-1">{product.price}</td>
                  <td className="border px-2 py-1">{product.quantity}</td>
                  <td className="border px-2 py-1">{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

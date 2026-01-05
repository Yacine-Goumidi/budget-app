import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BudgetContext } from '../context/BudgetContext';
import { saveLists, loadLists } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { generatePDF } from '../utils/pdf';

export default function Dashboard() {
  const navigate = useNavigate();
  const { budget, setBudget, products, setProducts } = useContext(BudgetContext);

  const [listName, setListName] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState('fixed'); // fixed | percentage

  /* ===================== CALCUL TOTAL ===================== */
  const totalSpent = products.reduce((acc, p) => {
    const baseTotal = p.price * p.quantity;
    const reduction =
      p.discountType === 'percentage' ? baseTotal * (p.discountValue / 100) : p.discountValue || 0;
    return acc + (baseTotal - reduction);
  }, 0);

  /* ===================== AJOUT PRODUIT ===================== */
  const addProduct = () => {
    if (!productName || !price || !quantity) return;

    setProducts([
      ...products,
      {
        id: uuidv4(),
        name: productName,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        discountValue: discountValue ? parseFloat(discountValue) : 0,
        discountType,
      },
    ]);

    setProductName('');
    setCategory('');
    setPrice('');
    setQuantity('');
    setDiscountValue('');
    setDiscountType('fixed');
  };

  /* ===================== SUPPRESSION PRODUIT ===================== */
  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  /* ===================== EXPORT PDF ===================== */
  const exportPDF = () => {
    generatePDF(products, totalSpent, budget, listName || `Liste du ${new Date().toLocaleDateString()}`);
  };

  /* ===================== SAUVEGARDE HISTORIQUE ===================== */
  const saveCurrentList = () => {
    if (products.length === 0) {
      alert('Impossible de sauvegarder une liste vide');
      return;
    }

    const lists = loadLists();

    const newList = {
      id: uuidv4(),
      date: new Date().toISOString(),
      name: listName || `Liste du ${new Date().toLocaleDateString()}`,
      budget,
      totalSpent,
      products,
    };

    saveLists([newList, ...lists]);
    alert('Liste sauvegardée dans l’historique ✅');
    setListName(''); // vider le champ
  };

  return (
    <div className="dashboard p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard - Gestion du Budget</h1>

        <button
          onClick={() => navigate('/history')}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Historique
        </button>
      </div>

      <div className="mb-4">
        <label className="font-semibold">Budget :</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
          className="border ml-2 px-2 py-1 rounded"
        />
      </div>

      {/* ===================== NOM DE LA LISTE ===================== */}
      <div className="mb-4">
        <label className="font-semibold">Nom de la liste :</label>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="Ex: Courses semaine 1"
          className="border ml-2 px-2 py-1 rounded"
        />
      </div>

      {/* ===================== AJOUT PRODUIT ===================== */}
      <div className="mb-4 border p-4 rounded">
        <h2 className="font-semibold mb-2">Ajouter un produit</h2>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Nom"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Prix"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Quantité"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Réduction"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="fixed">€</option>
            <option value="percentage">%</option>
          </select>

          <button
            onClick={addProduct}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* ===================== TABLE PRODUITS ===================== */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Produits</h2>

        {products.length === 0 ? (
          <p>Aucun produit ajouté</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border px-2">Nom</th>
                <th className="border px-2">Catégorie</th>
                <th className="border px-2">Prix</th>
                <th className="border px-2">Qté</th>
                <th className="border px-2">Réduction</th>
                <th className="border px-2">Total</th>
                <th className="border px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const baseTotal = p.price * p.quantity;
                const reduction =
                  p.discountType === 'percentage'
                    ? baseTotal * (p.discountValue / 100)
                    : p.discountValue || 0;

                return (
                  <tr key={p.id}>
                    <td className="border px-2">{p.name}</td>
                    <td className="border px-2">{p.category}</td>
                    <td className="border px-2">{p.price}</td>
                    <td className="border px-2">{p.quantity}</td>
                    <td className="border px-2">
                      {p.discountValue}
                      {p.discountType === 'percentage' ? '%' : ' €'}
                    </td>
                    <td className="border px-2">{(baseTotal - reduction).toFixed(2)}</td>
                    <td className="border px-2">
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={exportPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export PDF
        </button>

        <button
          onClick={saveCurrentList}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Sauvegarder dans l’historique
        </button>
      </div>

      <div className="mt-4 font-semibold">
        <p>Total dépensé : {totalSpent.toFixed(2)} €</p>
        <p>Budget restant : {(budget - totalSpent).toFixed(2)} €</p>
      </div>
    </div>
  );
}

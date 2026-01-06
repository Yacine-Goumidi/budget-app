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
  const [discountType, setDiscountType] = useState('fixed');

  /* ===================== CALCUL TOTAL ===================== */
  const totalSpent = products.reduce((acc, p) => {
    const baseTotal = p.price * p.quantity;
    const reduction =
      p.discountType === 'percentage'
        ? baseTotal * (p.discountValue / 100)
        : p.discountValue || 0;
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

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const exportPDF = () => {
    generatePDF(
      products,
      totalSpent,
      budget,
      listName || `Liste du ${new Date().toLocaleDateString()}`
    );
  };

  const saveCurrentList = () => {
    if (products.length === 0) return alert('Liste vide');

    const lists = loadLists();

    saveLists([
      {
        id: uuidv4(),
        date: new Date().toISOString(),
        name: listName || `Liste du ${new Date().toLocaleDateString()}`,
        budget,
        totalSpent,
        products,
      },
      ...lists,
    ]);

    alert('Liste sauvegardée ✅');
    setListName('');
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Dashboard Budget</h1>
        <button
          onClick={() => navigate('/history')}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Historique
        </button>
      </div>

      {/* BUDGET */}
      <div className="mb-4">
        <label className="font-semibold">Budget :</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
          className="border ml-2 px-2 py-1 rounded w-32"
        />
      </div>

      {/* NOM LISTE */}
      <div className="mb-4">
        <label className="font-semibold">Nom de la liste :</label>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          className="border ml-2 px-2 py-1 rounded w-full sm:w-1/2"
        />
      </div>

      {/* AJOUT PRODUIT */}
      <div className="border p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Ajouter un produit</h2>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
          <input placeholder="Nom" value={productName} onChange={e => setProductName(e.target.value)} className="border px-2 py-1 rounded" />
          <input placeholder="Catégorie" value={category} onChange={e => setCategory(e.target.value)} className="border px-2 py-1 rounded" />
          <input type="number" placeholder="Prix" value={price} onChange={e => setPrice(e.target.value)} className="border px-2 py-1 rounded" />
          <input type="number" placeholder="Qté" value={quantity} onChange={e => setQuantity(e.target.value)} className="border px-2 py-1 rounded" />
          <input type="number" placeholder="Réduction" value={discountValue} onChange={e => setDiscountValue(e.target.value)} className="border px-2 py-1 rounded" />
          <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="border px-2 py-1 rounded">
            <option value="fixed">€</option>
            <option value="percentage">%</option>
          </select>
        </div>

        <button
          onClick={addProduct}
          className="mt-3 bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Ajouter
        </button>
      </div>

      {/* PRODUITS – MOBILE */}
      <div className="space-y-3 sm:hidden">
        {products.map(p => {
          const total =
            p.discountType === 'percentage'
              ? p.price * p.quantity * (1 - p.discountValue / 100)
              : p.price * p.quantity - p.discountValue;

          return (
            <div key={p.id} className="border rounded p-3 shadow">
              <h3 className="font-semibold">{p.name}</h3>
              <p>{p.category}</p>
              <p>Prix: {p.price} €</p>
              <p>Qté: {p.quantity}</p>
              <p>Réduction: {p.discountValue}{p.discountType === 'percentage' ? '%' : ' €'}</p>
              <p className="font-semibold">Total: {total.toFixed(2)} €</p>
              <button
                onClick={() => removeProduct(p.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded w-full"
              >
                Supprimer
              </button>
            </div>
          );
        })}
      </div>

      {/* PRODUITS – DESKTOP */}
      <table className="hidden sm:table w-full border mt-4">
        <thead>
          <tr>
            {['Nom', 'Catégorie', 'Prix', 'Qté', 'Réduction', 'Total', ''].map(h => (
              <th key={h} className="border px-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(p => {
            const total =
              p.discountType === 'percentage'
                ? p.price * p.quantity * (1 - p.discountValue / 100)
                : p.price * p.quantity - p.discountValue;

            return (
              <tr key={p.id}>
                <td className="border px-2">{p.name}</td>
                <td className="border px-2">{p.category}</td>
                <td className="border px-2">{p.price}</td>
                <td className="border px-2">{p.quantity}</td>
                <td className="border px-2">{p.discountValue}{p.discountType === 'percentage' ? '%' : '€'}</td>
                <td className="border px-2">{total.toFixed(2)}</td>
                <td className="border px-2">
                  <button onClick={() => removeProduct(p.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    X
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ACTIONS */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <button onClick={exportPDF} className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto">
          Export PDF
        </button>
        <button onClick={saveCurrentList} className="bg-purple-500 text-white px-4 py-2 rounded w-full sm:w-auto">
          Sauvegarder
        </button>
      </div>

      <div className="mt-4 font-semibold">
        <p>Total : {totalSpent.toFixed(2)} €</p>
        <p>Restant : {(budget - totalSpent).toFixed(2)} €</p>
      </div>
    </div>
  );
}

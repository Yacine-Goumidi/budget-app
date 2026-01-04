import React, { useContext, useState } from 'react';
import { BudgetContext } from '../context/BudgetContext';
import ProductItem from '../components/ProductItem';
import { generatePDF } from '../utils/pdf';

function Dashboard() {
  const { budget, setBudget, products, setProducts } = useContext(BudgetContext);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('Alimentation');
  const [reduction, setReduction] = useState('');
  const [reductionType, setReductionType] = useState('pourcentage');

  // Filtre catégorie
  const [filter, setFilter] = useState('Tous');

  // Ajouter produit
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !quantity) return;

    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      type,
      reduction: reduction ? parseFloat(reduction) : 0,
      reductionType,
    };

    setProducts([...products, newProduct]);

    // Reset form
    setName('');
    setPrice('');
    setQuantity('');
    setType('Alimentation');
    setReduction('');
    setReductionType('pourcentage');
  };

  // Supprimer produit
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Liste filtrée
  const filteredProducts =
    filter === 'Tous'
      ? products
      : products.filter((p) => p.type === filter);

  // Total calculé
  const total = filteredProducts.reduce((acc, product) => {
    const productTotal =
      product.reductionType === 'pourcentage'
        ? product.price * product.quantity * (1 - product.reduction / 100)
        : product.reductionType === 'fixe'
        ? product.price * product.quantity - product.reduction
        : product.price * product.quantity;
    return acc + productTotal;
  }, 0);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Ta liste de course !</h1>

      {/* Budget */}
      <div style={{ marginBottom: '20px' }}>
        <label>Budget : </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value))}
        />
      </div>

      {/* Formulaire ajout produit */}
      <form onSubmit={handleAddProduct} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Nom du produit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: '5px' }}
        />

        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginRight: '5px' }}
        />

        <input
          type="number"
          placeholder="Quantité"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ marginRight: '5px' }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ marginRight: '5px' }}
        >
          <option>Alimentation</option>
          <option>Vêtements</option>
          <option>Sport</option>
          <option>Maison</option>
        </select>

        {/* Réduction alignée correctement */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginRight: '5px',
          }}
        >
          <input
            type="number"
            placeholder="Réduction"
            value={reduction}
            onChange={(e) => setReduction(e.target.value)}
            style={{ width: '100px' }}
          />
          <select
            value={reductionType}
            onChange={(e) => setReductionType(e.target.value)}
            style={{
              width: '50px',
              textAlign: 'center',
              padding: '6px',
            }}
          >
            <option value="pourcentage">%</option>
            <option value="fixe">€</option>
          </select>
        </div>

        <button type="submit">Ajouter</button>
      </form>

      {/* Filtre par type */}
      <div style={{ marginBottom: '20px' }}>
        <label>Filtrer par catégorie : </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>Tous</option>
          <option>Alimentation</option>
          <option>Vêtements</option>
          <option>Sport</option>
          <option>Maison</option>
        </select>
      </div>

      {/* Liste des produits */}
      <h2>Liste des produits</h2>
      {filteredProducts.length === 0 && <p>Aucun produit</p>}
      {filteredProducts.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onDelete={handleDeleteProduct}
        />
      ))}

      {/* Total */}
      <h2>Total : {total.toFixed(2)}€</h2>
      <p style={{ color: total > budget ? 'red' : 'green' }}>
        {total > budget ? 'Budget dépassé !' : 'Budget OK'}
      </p>

      {/* Bouton PDF */}
      <button
        onClick={() => generatePDF(filteredProducts, total, budget)}
        style={{ marginTop: '20px', padding: '8px 12px', cursor: 'pointer' }}
      >
        Exporter en PDF
      </button>
    </div>
  );
}

export default Dashboard;

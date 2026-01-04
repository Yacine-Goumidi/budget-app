import React from 'react';

function ProductItem({ product, onDelete }) {
  // Calcul du total du produit avec réduction
  const total =
    product.reductionType === 'pourcentage'
      ? product.price * product.quantity * (1 - product.reduction / 100)
      : product.reductionType === 'fixe'
      ? product.price * product.quantity - product.reduction
      : product.price * product.quantity;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px',
        margin: '5px 0',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }}
    >
      <div>
        <strong>{product.name}</strong> ({product.type})<br />
        Prix: {product.price}€ x {product.quantity} <br />
        Réduction: {product.reduction ? `${product.reduction}${product.reductionType === 'pourcentage' ? '%' : '€'}` : '0'} <br />
        <strong>Total: {total.toFixed(2)}€</strong>
      </div>
      <button
        style={{
          background: 'red',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
        onClick={() => onDelete(product.id)}
      >
        Supprimer
      </button>
    </div>
  );
}

export default ProductItem;

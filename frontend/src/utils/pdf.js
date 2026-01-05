// frontend/src/utils/pdf.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generatePDF(products, total, budget, listName = '') {
  const doc = new jsPDF();

  /* ===================== HEADER ===================== */
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(listName || 'Liste de courses', 105, 18, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date : ${new Date().toLocaleString()}`, 105, 25, { align: 'center' });

  /* ===================== TABLE ===================== */
  const tableColumn = ['Nom', 'Type', 'Prix', 'Qté', 'Réduction', 'Total'];
  const tableRows = [];

  products.forEach(product => {
    const baseTotal = product.price * product.quantity;
    const reduction =
      product.discountType === 'percentage'
        ? baseTotal * (product.discountValue / 100)
        : product.discountValue || 0;
    const productTotal = baseTotal - reduction;

    tableRows.push([
      product.name,
      product.category,
      `${product.price.toFixed(2)} €`,
      product.quantity,
      product.discountValue
        ? `${product.discountValue}${product.discountType === 'percentage' ? '%' : ' €'}`
        : '-',
      `${productTotal.toFixed(2)} €`,
    ]);
  });

  autoTable(doc, {
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [60, 60, 60],
      textColor: 255,
      halign: 'center',
    },
    columnStyles: {
      2: { halign: 'right' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'right' },
    },
  });

  /* ===================== SUMMARY ===================== */
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text(`Total général : ${total.toFixed(2)} €`, 14, finalY);
  doc.text(`Budget : ${budget.toFixed(2)} €`, 14, finalY + 8);

  if (total > budget) {
    doc.setTextColor(200, 0, 0);
    doc.text('Statut : BUDGET DEPASSE', 14, finalY + 16);
  } else {
    doc.setTextColor(0, 140, 70);
    doc.text('Statut : Budget OK', 14, finalY + 16);
  }

  /* ===================== FOOTER ===================== */
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text('Généré par Budget App', 105, 290, { align: 'center' });

  doc.save(`${listName || 'liste_de_courses'}.pdf`);
}

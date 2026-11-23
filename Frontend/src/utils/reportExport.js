const formatCsvValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const downloadCsvReport = (filename, headers, rows) => {
  const csv = [
    headers,
    ...rows,
  ].map((row) => row.map(formatCsvValue).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const printReport = (title, headers, rows) => {
  const reportWindow = window.open('', '_blank');
  if (!reportWindow) return false;

  const reportDocument = reportWindow.document;
  reportDocument.title = title;

  const style = reportDocument.createElement('style');
  style.textContent = `
    @page { size: landscape; margin: 14mm; }
    body { color: #26372d; font: 12px Arial, sans-serif; }
    h1 { margin: 0 0 6px; font-size: 22px; }
    p { margin: 0 0 18px; color: #68766d; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; border: 1px solid #dfe7df; text-align: left; vertical-align: top; }
    th { background: #d94151; color: #fff; }
    tr { break-inside: avoid; }
  `;
  reportDocument.head.appendChild(style);

  const heading = reportDocument.createElement('h1');
  heading.textContent = title;
  const generated = reportDocument.createElement('p');
  generated.textContent = `Generated ${new Date().toLocaleString()}`;
  const table = reportDocument.createElement('table');
  const tableHead = reportDocument.createElement('thead');
  const headerRow = reportDocument.createElement('tr');
  headers.forEach((header) => {
    const cell = reportDocument.createElement('th');
    cell.textContent = header;
    headerRow.appendChild(cell);
  });
  tableHead.appendChild(headerRow);
  table.appendChild(tableHead);

  const tableBody = reportDocument.createElement('tbody');
  rows.forEach((row) => {
    const tableRow = reportDocument.createElement('tr');
    row.forEach((value) => {
      const cell = reportDocument.createElement('td');
      cell.textContent = value ?? '';
      tableRow.appendChild(cell);
    });
    tableBody.appendChild(tableRow);
  });
  table.appendChild(tableBody);
  reportDocument.body.append(heading, generated, table);

  reportWindow.addEventListener('afterprint', () => reportWindow.close(), { once: true });
  reportWindow.focus();
  reportWindow.print();
  return true;
};

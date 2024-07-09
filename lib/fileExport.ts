import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import { formatDate } from './formatter';

export const exportToExcel = async (data: Record<string, string | number>[], title: string, worksheetName: string) => {
  try {
    const dateNow = formatDate(new Date());

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils?.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
    // Save the workbook as an Excel file
    XLSX.writeFile(workbook, `${title}_${dateNow.replace(/,|\s+/g, '_')}.xlsx`);
  } catch (error) {
    throw new Error('Error when download worksheet');
  }
}

export const exportCSV = (jsonData: Array<{ [key: string]: string | number }>, filename: string): void => {
  const csvRows = [];
  const dateNow = formatDate(new Date());
  const headers = Object.keys(jsonData[0]);
  csvRows.push(headers.join(','));

  for (const row of jsonData) {
    const values = headers.map(header => {
      const escape = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escape}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');

  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}_${dateNow.replace(/,|\s+/g, '_')}.csv`);
  a.click();

  window.URL.revokeObjectURL(url);
}

export const exportPDF = (data: Record<string, string | number>[], title: string, filename: string,) => {
  const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const marginLeft = 40;

    const dateNow = formatDate(new Date());
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(14)

    const tableColumn = Object.keys(data[0]);
    const tableRows = data.map(data => tableColumn.map(key => data[key]));

    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
    });
    doc.text(title, marginLeft, 40);
    doc.save(`${filename}_${dateNow.replace(/,|\s+/g, '_')}.pdf`);
}
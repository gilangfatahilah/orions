import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
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

export const generatePDF = async (element: HTMLElement, pdfFileName: string = 'download.pdf', title?: string): Promise<void> => {
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('l', 'mm', 'a4');
  const imgWidth = 297;
  const pageHeight = 210;
  const margin = 10;
  const titleHeight = 10;
  const imgHeight = canvas.height * (imgWidth - margin * 2) / canvas.width;
  let heightLeft = imgHeight;

  if (title) {

    let position = titleHeight + margin;
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    
    pdf.text(title, imgWidth / 2, margin, { align: 'center' });
    
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth - margin * 2, imgHeight);
    heightLeft -= (pageHeight - position);
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth - margin * 2, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(pdfFileName);
    return;
  }

  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(pdfFileName);
};

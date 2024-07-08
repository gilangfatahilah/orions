// utils/excel.ts

import * as XLSX from 'xlsx';

export const importExcelData = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = e.target?.result;
      if (arrayBuffer) {
        const binaryStr = new Uint8Array(arrayBuffer as ArrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '');
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        resolve(jsonData);
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
};

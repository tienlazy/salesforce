// import { LightningElement } from 'lwc';
// // import readFiles from '@salesforce/apex/readFileController.convert';

// export default class MyComponent extends LightningElement {
//     // searchKey;
//     // @api fileName
//     // @wire (readFiles,{str: '$searchKey'}) convert;
//     // handleFileUpload(event) {
//     //     const file = event.target.files[0];
//     //     this.fileName = file.name;
//     //     const reader = new FileReader();
//     //     reader.onload  = (event) => {
//     //         const binary = event.target.result;
//     //         this.searchKey = binary;  
//     //         let base64 = 'base64,';
//     //         let content = reader.result.indexOf(base64) + base64.length;
//     //         let fileContents = reader.result.substring(content);
//     //         readFiles({ base64Data: encodeURIComponent(fileContents), strFileName: this.fileName })
//     //         .then(result => {
//     //             console.log("convert: " + JSON.stringify(result));
//     //         })
//     //     }

//     handleFileSelect(event) {
//         const file = event.target.files[0];
//         const reader = new FileReader();

//         reader.onload = (event) => {
//             const csvData = event.target.result;
//             const rows = parseCSV(csvData);
//             console.log(rows);
//         };

//         reader.onerror = (event) => {
//             console.error('File reading failed:', event.target.error);
//         };

//         reader.readAsText(file);
//     }

//         //     const converted = binary.replace(/\\u(\d{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
//         //     console.log("binary: " + binary);
//         //     console.log("binary1111: " + converted);

//         //     const uint8array = new Uint8Array(reader.result);
//         //     const decoder = new TextDecoder('utf-8');
//         //     const text = decoder.decode(uint8array);
//         //     console.log("222222222: " + text); // output the file contents as UTF-8 text
//         //     console.log("333333333: " + uint8array); // output the file contents as UTF-8 text

//         //     const uint8array1 = new Uint8Array(binary);
//         //     const decoder1 = new TextDecoder('utf-8');
//         //     const text1 = decoder.decode(uint8array1);
//         //     console.log("444444: " + text1); // output the file contents as UTF-8 text
//         //     console.log("555555: " + uint8array); // output the file contents as UTF-8 text

//         //     const workbook = this.parseWorkbook(binary);
//         //     const sheetName = workbook.sheetNames[0];
//         //     const sheetData = this.parseSheet(workbook.sheets[sheetName]);
//         //     console.log('Sheet data:', sheetData);
//         // };
//         // reader.onerror = () => {
//         //     console.error('File reading failed:', this.target.error);
//         // };
// //         reader.readAsBinaryString(file);
// // }

//     // parseWorkbook(binary) {
//     //     const data = new Uint8Array(str2ab(binary));
//     //     const arr = [];
//     //     for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
//     //     const workbook = {};
//     //     const wb = arr.join('');
//     //     const sheets = {};
//     //     workbook.sheets = sheets;
//     //     workbook.sheetNames = [];
//     //     const worksheets = wb.match(/<sheet.+?\/>/g);
//     //     for (let i = 0; i < worksheets.length; i++) {
//     //         const sheetAttributes = this.parseAttributes(worksheets[i]);
//     //         const sheetId = sheetAttributes.id;
//     //         const sheetName = sheetAttributes.name;
//     //         workbook.sheetNames[sheetId] = sheetName;
//     //         sheets[sheetName] = this.parseSheetData(wb, sheetAttributes);
//     //     }
//     //     return workbook;
//     // }

//     // str2ab(str) {
//     //     const buf = new ArrayBuffer(str.length * 2);
//     //     const bufView = new Uint16Array(buf);
//     //     for (let i = 0, strLen = str.length; i < strLen; i++) {
//     //       bufView[i] = str.charCodeAt(i);
//     //     }
//     //     return buf;
//     //   }

//     // parseSheetData(wb, sheetAttributes) {
//     //     const sheetId = sheetAttributes.id;
//     //     const rID = "rID" + sheetId;
//     //     const sheet = {};
//     //     const rRegex = new RegExp('<' + rID + ':.+?/r>', 'g');
//     //     const rows = wb.match(rRegex);
//     //     for (let i = 0; i < rows.length; i++) {
//     //         const row = {};
//     //         const cellsRegex = new RegExp('<' + rID + ':.+?/c>', 'g');
//     //         const cells = rows[i].match(cellsRegex);
//     //         for (let j = 0; j < cells.length; j++) {
//     //             const cellAttributes = this.parseAttributes(cells[j]);
//     //             const cellIndex = cellAttributes.r;
//     //             const cellValue = this.parseCellValue(wb, cellAttributes.t, cellAttributes.v);
//     //             row[cellIndex] = cellValue;
//     //         }
//     //         sheet[i + 1] = row;
//     //     }
//     //     return sheet;
//     // }

//     // parseSheet(sheetData) {
//     //     const sheet = [];
//     //     const keys = Object.keys(sheetData);
//     //     keys.forEach((key) => {
//     //         sheet.push(sheetData[key]);
//     //     });
//     //     return sheet;
//     // }

//     // parseCellValue(wb, cellType, cellValue) {
//     //     let value = '';
//     //     if (cellType === 's') {
//     //         const index = parseInt(cellValue);
//     //         const text = wb.match(/<si>.*?<\/si>/g)[index];
//     //         const t = text.match(/<t>(.*?)<\/t>/)[1];
//     //         value = t;
//     //     } else if (cellType === 'str') {
//     //         value = cellValue;
//     //     } else if (cellType === 'b') {
//     //         value = cellValue === '1';
//     //     } else if (cellType === 'n') {
//     //         value = parseFloat(cellValue);
//     //     } else if (cellType === 'd') {
//     //         value = new Date(Date.parse(cellValue)).toLocaleString();
//     //     }
//     //     return value;
//     // }

//     parseCSV(csvString) {
//         const lines = csvString.split('\n');
//         const headers = lines[0].split(',');

//         const rows = [];
//         for (let i = 1; i < lines.length; i++) {
//             const row = {};
//             const cells = lines[i].split(',');
//             for (let j = 0; j < cells.length; j++) {
//                 row[headers[j]] = cells[j];
//             }
//             rows.push(row);
//         }

//         return rows;
//     }

// }


import { LightningElement } from 'lwc';
import uploadFile from '@salesforce/apex/readFileController.uploadFile';

export default class MyComponent extends LightningElement {
    handleFileUpload(event) {
    const file = event.target.files[0];
    this.uploadFileToApex(file);
  }

  async uploadFileToApex(file) {
    const reader = new FileReader();

    reader.onload = async () => {
      const fileContents = reader.result;
      const fileName = file.name;

      try {
        const result = await uploadFile({ fileName, fileContents });
        console.log(result);
        // Handle successful upload
      } catch (error) {
        // Handle upload error
      }
    };

    reader.readAsArrayBuffer(file);
  }
}


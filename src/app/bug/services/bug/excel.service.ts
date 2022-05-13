import {Injectable} from '@angular/core';
import {Workbook} from 'exceljs';
import * as fs from 'file-saver';
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
/**
 * Helper class to build up the Excel file of a bug list to be exported.
 */
export class ExcelService {

  private FILE_NAME = 'ListOfBugs_';

  constructor() {
  }

  downloadExcel(header: string[], content: string[][]) {
    const fileName = this.FILE_NAME + formatDate(Date.now(), 'd_M_Y_h_m_s', 'en-US') + '.xlsx';
    try {
      this.createWorkbook(header, content).xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        fs.saveAs(blob, fileName);
      });
    } catch (e) {
      throw 'Failed to download excel! ' + e;
    }
  }

  private createWorkbook(header, content) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Bug List');
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      ExcelService.styleHeader(cell);
    });
    content.forEach(row => {
      let addRow = worksheet.addRow(row);
      ExcelService.styleTableContent(addRow);
    })
    worksheet.autoFilter = {
      from: {
        row: 1,
        column: 1
      },
      to: {
        row: header.length + 1,
        column: content.length + 1
      }
    }
    worksheet.columns.forEach(column => {
      column.width = 28
    });

    return workbook;
  }

  private static styleHeader(cell) {
    cell.font = {
      name: 'Arial Helvetica',
      color: {argb: 'FFFFFF'},
      size: 16,
      bold: true
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: '0070C0'},
      bgColor: {argb: '0070C0'}
    };
    cell.alignment = {vertical: 'middle', horizontal: 'center'};
  }

  private static styleTableContent(row) {
    row.eachCell(cell => {
      cell.font = {
        name: 'Arial Helvetica',
        size: 12,
        bold: false
      }
    })
  }
}

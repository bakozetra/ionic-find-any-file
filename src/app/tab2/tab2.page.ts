import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  NgZone,
  ElementRef,
  HostListener,
} from '@angular/core';

import { NgxResizeWatcherDirective } from './checkerDirective.service';

export interface Data {
  movies: string;
}
const INITIALCOLUMNS = [
  { name: 'Name', hidden: false, minWidth: 0, width: 0 },
  { name: 'Company', hidden: false, minWidth: 0, width: 0 },
  { name: 'Genre', hidden: false, minWidth: 0, width: 0 },
  { name: 'Image', hidden: false, minWidth: 0, width: 0 },
];

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Tab2Page implements OnInit {
  public data: Data;
  public columns: any;
  public tempColumns: any;
  public rows: any;
  public sort: any;
  sortOrder = [];
  public columnVisibility;
  public ignoreFitContent = new Set([]);
  columnsWidth = {};
  editing = {};
  ngxResizeWatcherDirective;
  rowHeight;
  togglecheck = [{ ischecked: false }];
  touchtime = 0;
  imageWidth: string;
  styleCSS = {
    innerHeight: '100%',
    innerWidth: 'auto',
    rowHeigt: '5rem',
    height: '100%',
    textAreaWidth: '100%',
    textAreaMinHight: 'auto',
  };

  constructor(
    private http: HttpClient,
    private _zone: NgZone,
    private elementRef: ElementRef,
    private platform: Platform
  ) {
    this.tempColumns = INITIALCOLUMNS;
    this.columns = [
      { name: 'Name', hidden: false, minWidth: 0, width: 0 },
      { name: 'Company', hidden: false, minWidth: 0, width: 0 },
      { name: 'Genre', hidden: false, minWidth: 0, width: 0 },
      { name: 'Image', hidden: false, minWidth: 0, width: 0 },
    ];
    this.ngxResizeWatcherDirective = NgxResizeWatcherDirective;
  }
  desktopPlatforme = this.platform.is('desktop');
  mobilePlatforme = this.platform.is('android');
  iosPlaform = this.platform.is('iphone');
  ipadPlatform = this.platform.is('ipad');

  ngOnInit(): void {
    if (this.getLocalStoragSort() !== null) {
      this.sortOrder = this.getDataRowSort();
    }
    if (this.getLocalStoragDrag !== null) {
      this.columns = this.getDataRowDrag();
    }
    if (this.gettoggleRowChanges() !== null) {
      this.togglecheck = this.getToggleRow();
    }

    if (this.getLocalStorageRow() !== null) {
      this.rows = JSON.parse(this.getLocalStorageRow());
    } else {
      this.http.get<Data>('../../assets/movies.json').subscribe((res) => {
        this.rows = res.movies;
      });
    }
    if (!this.getLocalStorageColumnVisibility()) {
      this.setLocalStorageColumnVisibility(INITIALCOLUMNS);
      this.columnVisibility = JSON.parse(JSON.stringify(INITIALCOLUMNS));
    } else {
      this.columnVisibility = this.getLocalStorageColumnVisibility();
    }

    this.columns = this.columns.filter((col) => {
      const colomnName = col.name;
      const isHidden = this.columnVisibility.find(
        (visibilityCol) => visibilityCol.name === colomnName
      ).hidden;
      return !isHidden;
    });
  }

  onSortColumn(event) {
    this.setLocalStorageSort(event.sorts);
  }

  reorderColumn(event) {
    const arr = this.array_move(this.columns, event.prevValue, event.newValue);
    this.setLocalStorageDrag(arr);
  }

  onDoubleclick(rowIndex, cell) {
    if (this.touchtime == 0) {
      this.touchtime = new Date().getTime();
    } else {
      if (new Date().getTime() - this.touchtime < 800) {
        if (this.iosPlaform || this.ipadPlatform) {
          this.editing[rowIndex + '-' + cell] = true;
          this.touchtime = 0;
        }
      } else {
        this.touchtime = new Date().getTime();
      }
    }
  }

  toggleRow(e, checked) {
    if (!e.detail.checked) {
      this.togglecheck[0].ischecked = false;
      checked = this.togglecheck[0].ischecked;
      this.rowHeight = undefined;
      const imgwidth =
        this.imageWidth === undefined
          ? this.styleCSS.innerWidth
          : this.imageWidth + 'px';
      this.element(imgwidth, this.styleCSS.innerHeight);
      this.setLocalStoragetoggleRow(this.togglecheck);
    } else {
      this.togglecheck[0].ischecked = true;
      checked = this.togglecheck[0].ischecked;
      this.rowHeight = this.styleCSS.rowHeigt;
      this.element(this.rowHeight, this.styleCSS.innerWidth);
      this.setLocalStoragetoggleRow(this.togglecheck);
    }
  }

  toggleColumn(toggleName, event) {
    const updateColumns = this.columnVisibility.map((columnName) => {
      if (columnName.name === toggleName) {
        columnName.hidden = !columnName.hidden;
      }
      return columnName;
    });
    this.columns = updateColumns.filter((col) => {
      const colomnName = col.name;
      const isHidden = this.columnVisibility.find(
        (visibilityCol) => visibilityCol.name === colomnName
      ).hidden;
      return !isHidden;
    });
    // to remove the column name inside of the content
    this.ignoreFitContent = new Set([]);
    this.setLocalStorageColumnVisibility(updateColumns);
    this.setLocalStorageDrag(updateColumns);
  }

  // Resizing row image function
  element(width, height) {
    console.log('this.rows::::::', this.rows);
    this.rows?.map((val, index) => {
      console.log('val::::::val', val);
      const imagelement = document.getElementById(index);
      imagelement.style.width = width;
      imagelement.style.height = height;
    });
  }

  resizingColumn(e) {
    const allHeaders = document.querySelectorAll<HTMLElement>(
      '.datatable-header-cell'
    );

    if (e?.column?.name) {
      this.ignoreFitContent.add(e.column.name);
      const resizedCol = this.columns.find((c) => {
        return c.name === e.column.name;
      });
      resizedCol.minWidth = 0;
      allHeaders.forEach((header) => {
        if (header.innerText.trim() === e.column.name) {
          resizedCol.width = header?.clientWidth;
          this.columnsWidth[e.column.name] = header?.clientWidth;
          if (e.column.name === 'Image') {
            this.imageWidth = header?.clientWidth as unknown as string;
          }
        }
      });
    }
    if (this.togglecheck[0].ischecked) {
      this.element(this.styleCSS.rowHeigt, this.styleCSS.innerWidth);
    }
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }

  updateCellValue(event, cellTile?, rowIndex?) {
    this.editing[rowIndex + '-' + cellTile] = false;
    console.log(
      'this.editing[rowIndex +  - + cellTile]::::::',
      this.editing[rowIndex + '-' + cellTile]
    );
    console.log('this.editing::::::', this.editing);
    this.rows[rowIndex][cellTile] = event.target.value;
    this.rows = [...this.rows];
    this.adjustColumnMinWidth(true);
    this.setLocalStorageRow(this.rows);
  }
  onResetEdit(cellTile?, rowIndex?) {
    this.editing[rowIndex + '-' + cellTile] = false;
  }

  @HostListener('pointerdown', ['$event']) onPointerDown(e) {
    e.stopPropagation();
    const elementclassName = e.srcElement.className;
    const columnName = e?.target?.parentNode?.querySelector(
      '.datatable-header-cell-label'
    )?.innerHTML;
    if (
      elementclassName === 'datatable-header-cell-label draggable' ||
      elementclassName === 'sort-btn datatable-icon-up sort-asc' ||
      elementclassName === 'datatable-icon-down sort-btn sort-desc' ||
      elementclassName === 'datatable-icon-sort-unset sort-btn' ||
      elementclassName === 'sort-btn datatable-icon-down sort-desc' ||
      elementclassName === 'datatable-header-cell-template-wrap'
    ) {
      return;
    }
    if (columnName !== undefined) {
      this.ignoreFitContent.add(columnName?.trim());
      const resizedCol = this.columns?.find((c) => {
        return c?.name.trim() === columnName?.trim();
      });
      resizedCol.minWidth = 0;
    }
    if (this.togglecheck[0].ischecked) {
      this.element(this.styleCSS.rowHeigt, this.styleCSS.innerWidth);
    }
  }

  createRangeCell(cellSizer, columnName, fresh, i) {
    try {
      var range = document?.createRange();
      range?.selectNode(cellSizer);
      var rect = range.getBoundingClientRect().width;
      range.detach();
      if (!(columnName in this.columnsWidth)) {
        this.columnsWidth = { ...this.columnsWidth, [columnName]: 0 };
      }
      const currentColunWidth =
        fresh && i === 0 ? 0 : this.columnsWidth[columnName];

      if (rect < 100) {
        rect = 100;
      }
      const newColumnWidth = Math.max(currentColunWidth, rect);
      let currrentColumnIndex;
      this.columns.find((col, index) => {
        if (col.name === columnName) {
          currrentColumnIndex = index;
          return true;
        } else {
          return false;
        }
      });

      return { newColumnWidth, currrentColumnIndex };
    } catch (e) {
      console.log('e::getting width error::::', e);
    }
  }

  adjustColumnMinWidth(fresh = false) {
    const element = this.elementRef.nativeElement as HTMLElement;
    const rows = element.getElementsByTagName('datatable-body-row');
    if (this.togglecheck[0].ischecked) {
      this.element(this.styleCSS.rowHeigt, this.styleCSS.innerWidth);
    }
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('datatable-body-cell');

      for (let k = 0; k < cells.length; k++) {
        if (!this.ignoreFitContent.has(this.columns[k].name)) {
          const cell = cells[k];

          let cellSizer = cell.children[0]?.children[0]?.children[0]?.lastChild;
          const columnName = this.columns[k].name;
          if (columnName === 'Image') {
            cellSizer = cell.children[0]?.children[0]?.children[0];
          }
          const { newColumnWidth, currrentColumnIndex } = this.createRangeCell(
            cellSizer,
            columnName,
            fresh,
            i
          );
          this.columnsWidth[columnName] = newColumnWidth;
          this.columns[currrentColumnIndex].minWidth = newColumnWidth;
          this.columns[currrentColumnIndex].width = newColumnWidth;
          this.columns = this.columns;
          // this.setLocalStorageColumnVisibility(columnImageWidth);
        }
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const arr = this.array_move(
      this.columns,
      event.previousIndex,
      event.currentIndex
    );
    this.setLocalStorageDrag(arr);
  }

  @HostListener('dblclick', ['$event']) onDblClick(event) {
    document.getElementById('editBox')?.focus();
  }

  onEdit(rowIndex, column) {
    this.editing[rowIndex + '-' + column] = true;
  }
  onTextAreaFocused(event) {
    console.log('event::::::onTextAreaFocused', event);
  }

  setLocalStorageRow(data) {
    return localStorage.setItem('row-data', JSON.stringify(data));
  }
  getLocalStorageRow() {
    return localStorage.getItem('row-data');
  }
  getDataRowChanges(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStorageRow();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  // Loacal storage for column visibility
  setLocalStorageColumnVisibility(data) {
    return localStorage.setItem('column-visibility', JSON.stringify(data));
  }
  getLocalStorageColumnVisibility() {
    return JSON.parse(localStorage.getItem('column-visibility'));
  }

  // Local storage for resizing row
  setLocalStoragetoggleRow(data) {
    return localStorage.setItem('resize-row', JSON.stringify(data));
  }
  gettoggleRowChanges() {
    return localStorage.getItem('resize-row');
  }
  getToggleRow(): any {
    let localJSON = this.tempColumns;
    const localData = this.gettoggleRowChanges();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  // Local Storage for sorting
  setLocalStorageSort(data) {
    return localStorage.setItem('sorting', JSON.stringify(data));
  }
  getLocalStoragSort() {
    return localStorage.getItem('sorting');
  }
  getDataRowSort(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStoragSort();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  // Local storage for dragging
  setLocalStorageDrag(data) {
    return localStorage.setItem('drag', JSON.stringify(data));
  }
  getLocalStoragDrag() {
    return localStorage.getItem('drag');
  }
  getDataRowDrag(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStoragDrag();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }
  // Saving column width in Local storage
  setLocalStorageColumnWidth(data) {
    return localStorage.setItem('column-width', JSON.stringify(data));
  }
  getLocalStorageColumnWidth() {
    return JSON.parse(localStorage.getItem('column-width'));
  }
}

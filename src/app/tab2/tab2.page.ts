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
    console.log(
      '!this.getLocalStorageColumnVisibility()::::::',
      !this.getLocalStorageColumnVisibility()
    );
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

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  @HostListener('pointerdown', ['$event']) onPointerDown(e) {
    e.stopPropagation();
    const elementclassName = e.srcElement.className;
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
    const columnName = e?.target?.parentNode?.querySelector(
      '.datatable-header-cell-label'
    )?.innerHTML;

    if (columnName !== undefined) {
      this.ignoreFitContent.add(columnName?.trim());
      const resizedCol = this.columns?.find((c) => {
        return c?.name.trim() === columnName?.trim();
      });
      resizedCol.minWidth = 0;
    }
    if (this.togglecheck[0].ischecked) {
      this.element('5rem', 'auto');
    }
  }

  touchtime = 0;
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

  setLocalStorageChages(data) {
    return localStorage.setItem('column-data', JSON.stringify(data));
  }
  setLocalStorageRow(data) {
    return localStorage.setItem('row-data', JSON.stringify(data));
  }

  setLocalStorageColumnVisibility(data) {
    return localStorage.setItem('column-visibility', JSON.stringify(data));
  }

  getLocalStorageColumnVisibility() {
    return JSON.parse(localStorage.getItem('column-visibility'));
  }

  getLocalStorageRow() {
    return localStorage.getItem('row-data');
  }
  getlocatChanges() {
    return localStorage.getItem('column-data');
  }

  getDataCoumnChanges(): any {
    let localJSON = this.tempColumns;
    const localData = this.getlocatChanges();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }
  getDataRowChanges(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStorageRow();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  toggleColumn(toggleName, event) {
    console.log('event::::::', event);
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
  element(width, height) {
    this.rows.map((val, index) => {
      const imagelement = document.getElementById(index);
      imagelement.style.width = width;
      imagelement.style.height = height;
    });
  }

  toggleRow(e, checked) {
    if (!e.detail.checked) {
      this.togglecheck[0].ischecked = false;
      checked = this.togglecheck[0].ischecked;
      this.rowHeight = undefined;
      const imgwidth =
        this.imageWidth === undefined ? 'auto' : this.imageWidth + 'px';
      this.element(imgwidth, '100%');
      this.setLocalStoragetoggleRow(this.togglecheck);
    } else {
      this.togglecheck[0].ischecked = true;
      checked = this.togglecheck[0].ischecked;
      this.rowHeight = '5rem';
      this.element('5rem', 'auto');
      this.setLocalStoragetoggleRow(this.togglecheck);
    }
  }

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

  setLocalStorageSort(data) {
    return localStorage.setItem('sorting', JSON.stringify(data));
  }
  imageWidth: string;
  resize(e) {
    console.log('e::::::', e);
    if (e?.column?.name) {
      this.ignoreFitContent.add(e.column.name);
      const resizedCol = this.columns.find((c) => {
        return c.name === e.column.name;
      });
      resizedCol.minWidth = 0;
      const allHeaders = document.querySelectorAll<HTMLElement>(
        '.datatable-header-cell'
      );
      allHeaders.forEach((header) => {
        if (header.innerText.trim() === e.column.name) {
          resizedCol.width = header?.clientWidth;
          console.log('header?.clientWidth::::::', header?.clientWidth);
          console.log('e.column.name::::::', e.column.name);
          this.columnsWidth[e.column.name] = header?.clientWidth;
          console.log('this.columnsWidth::::::resize', this.columnsWidth);
          if (e.column.name === 'Image') {
            this.imageWidth = header?.clientWidth as unknown as string;
          }
        }
      });
    }
    if (this.togglecheck[0].ischecked) {
      this.element('5rem', 'auto');
    }
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

  onSort(event) {
    this.setLocalStorageSort(event.sorts);
  }
  rearrange(event) {
    const arr = this.array_move(this.columns, event.prevValue, event.newValue);
    this.setLocalStorageDrag(arr);
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

  updateValue(event, cell?, rowIndex?) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.ignoreFitContent = new Set([]);
    this.adjustColumnMinWidth(true);
    this.setLocalStorageRow(this.rows);
  }

  adjustColumnMinWidth(fresh = false) {
    if (this.togglecheck[0].ischecked) {
      this.element('5rem', 'auto');
    }

    const element = this.elementRef.nativeElement as HTMLElement;
    const rows = element.getElementsByTagName('datatable-body-row');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('datatable-body-cell');
      for (let k = 0; k < cells.length; k++) {
        if (this.ignoreFitContent.has(this.columns[k].name)) {
          return;
        }
        const cell = cells[k];
        console.log('cell::::::', cell);
        const cellSizer = cell.children[0]?.children[0]?.children[0]?.lastChild;
        const columnName = this.columns[k].name;
        if (columnName === 'Image') {
          const cellSizer1 = cell.children[0]?.children[0]?.children[0];
        }
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
          console.log('this.columnsWidth::::::', this.columnsWidth);
          const newColumnWidth = Math.max(currentColunWidth, rect);
          this.columnsWidth[columnName] = newColumnWidth;

          console.log(
            'this.columnsWidth[columnName]::::::',
            this.columnsWidth[columnName]
          );

          let currrentColumnIndex;
          const currrentColumn = this.columns.find((col, index) => {
            if (col.name === columnName) {
              currrentColumnIndex = index;
              return true;
            } else {
              return false;
            }
          });
          console.log('currrentColumn::::::', currrentColumn);
          console.log(
            'currrentColumn::::::JSON',
            JSON.stringify(currrentColumn),
            currrentColumn
          );
          console.log('this.columns::::::', JSON.stringify(this.columns));

          this.columns[currrentColumnIndex].minWidth = newColumnWidth;
          console.log(
            'this.columns[currrentColumnIndex].minWidth::::::',
            this.columns[currrentColumnIndex].minWidth
          );
          this.columns[currrentColumnIndex].width = newColumnWidth;
          console.log('newColumnWidth::::::', newColumnWidth);
          this.columns = this.columns;
        } catch (e) {
          console.log('e::getting width error::::', e);
        }
      }
      console.log('this.columnsWidth::::::', this.columnsWidth);
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
  test(e) {
    // console.log('e::::::test', e);
  }
  currentlyLoadedPage = 0;
}

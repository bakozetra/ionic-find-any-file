import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  NgZone,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import {
  forceFillColumnWidths,
  adjustColumnWidths,
} from '@swimlane/ngx-datatable';
import { NgxResizeWatcherDirective } from './checkerDirective.service';

export interface Data {
  movies: string;
}
const INITIALCOLUMNS = [
  { name: 'Name', hidden: false, minWidth: 0 },
  { name: 'Company', hidden: false, minWidth: 0 },
  { name: 'Genre', hidden: false, minWidth: 0 },
  { name: 'Image', hidden: false, minWidth: 0 },
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

  editing = {};
  ngxResizeWatcherDirective;

  constructor(
    private http: HttpClient,
    private _zone: NgZone,
    private elementRef: ElementRef
  ) {
    this.tempColumns = INITIALCOLUMNS;
    this.columns = [
      { name: 'Name', hidden: false, minWidth: 0 },
      { name: 'Company', hidden: false, minWidth: 0 },
      { name: 'Genre', hidden: false, minWidth: 0 },
      { name: 'Image', hidden: false, minWidth: 0 },
    ];
    this.ngxResizeWatcherDirective = NgxResizeWatcherDirective;
  }

  ngOnInit(): void {
    if (this.getLocalStoragSort() !== null) {
      this.sortOrder = this.getDataRowSort();
    }
    if (this.getLocalStoragDrag !== null) {
      this.columns = this.getDataRowDrag();
    }

    if (this.getLocalStorageRow() !== null) {
      this.rows = JSON.parse(this.getLocalStorageRow());
    } else {
      this.http.get<Data>('../../assets/movies.json').subscribe((res) => {
        console.log(res, 'resss');
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

  setLocalStorageChages(data) {
    console.log('data::::::', data);
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
    console.log('localData::::::', localData);
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }
  getDataRowChanges(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStorageRow();
    console.log('localData::::::', localData);
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  toggleme(toggleName) {
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

    this.setLocalStorageColumnVisibility(updateColumns);
  }

  // test1;
  setLocalStorageSort(data) {
    return localStorage.setItem('sorting', JSON.stringify(data));
  }

  getLocalStoragSort() {
    return localStorage.getItem('sorting');
  }

  getDataRowSort(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStoragSort();
    console.log('localData::::::', localData);
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }
  setLocalStorageDrag(data) {
    console.log('data::::::setLocalStorageDrag', data);
    return localStorage.setItem('drag', JSON.stringify(data));
  }

  getLocalStoragDrag() {
    return localStorage.getItem('drag');
  }

  getDataRowDrag(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStoragDrag();
    console.log('localData::::::', localData);
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  onSort(event) {
    this.setLocalStorageSort(event.sorts);
  }
  rearrange(event) {
    console.log('event::::::', event);
    // this.columns === this.columnVisibility
    const arr = this.array_move(this.columns, event.prevValue, event.newValue);
    console.log('event.prevValue::::::', event.prevValue);
    console.log('event.newValue::::::', event.newValue);
    console.log('arr::::::', arr);
    this.setLocalStorageDrag(arr);
  }
  array_move(arr, old_index, new_index) {
    console.log('(new_index >= arr.length::::::', new_index >= arr.length);
    if (new_index >= arr.length) {
      console.log('new_index::::::', new_index);
      var k = new_index - arr.length + 1;
      console.log('k::::::', k);
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

    return arr;
  }

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('this.rows::::::', this.rows);
    console.log('UPDATED!', this.rows[rowIndex][cell]);
    this.setLocalStorageRow(this.rows);
  }

  adjustColumnMinWidth() {
    const element = this.elementRef.nativeElement as HTMLElement;
    const columns = element.getElementsByTagName('datatable-header-cell');
    const rows = element.getElementsByTagName('datatable-body-row');
    let columnsWidth = {};
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('datatable-body-cell');
      for (let k = 0; k < cells.length; k++) {
        const cell = cells[k];
        const cellSizer = cell.children[0].children[0].children[0];
        var range = document.createRange();
        range.selectNode(cellSizer);
        var rect = range.getBoundingClientRect().width;
        range.detach();
        if (!(k in columnsWidth)) {
          columnsWidth = { ...columnsWidth, [k]: 0 };
        }
        const currentColunWidth = columnsWidth[k];
        const newColumnWidth = Math.max(currentColunWidth, rect);
        columnsWidth[k] = newColumnWidth;
        this.columns[k].minWidth = newColumnWidth;
      }
    }
  }

  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    console.log('event::::::', event);
    const keyCode = event.which || event.keyCode;
    console.log('keyCode::::::', keyCode);
    if (keyCode === 13 && !event.shiftKey) {
    }
  }
}

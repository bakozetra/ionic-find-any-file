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
  OnDestroy,
  AfterViewChecked,
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
  public ignoreFitContent = new Set([]);

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
      console.log('this.columns::::::this.columns', this.columns);
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

    const element = this.elementRef.nativeElement as HTMLElement;
    const rows = element.getElementsByTagName('datatable-header-cell');
    console.log('rows::::::', rows);
  }

  @ViewChild('table') table: DatatableComponent;

  //   @HostListener('window:resize', ['$event'])
  //   onResize(event) {
  //     this.table.recalculate();
  //     this.table.recalculateColumns();
  //   }

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
    console.log('updateColumns::::::toggleme', updateColumns);
    this.columns = updateColumns.filter((col) => {
      const colomnName = col.name;
      const isHidden = this.columnVisibility.find(
        (visibilityCol) => visibilityCol.name === colomnName
      ).hidden;
      return !isHidden;
    });

    this.setLocalStorageColumnVisibility(updateColumns);
    this.setLocalStorageDrag(updateColumns);
  }

  setLocalStorageSort(data) {
    return localStorage.setItem('sorting', JSON.stringify(data));
  }

  resize(e) {
    console.log('e::::::', e);
    if (e.column.name) {
      this.ignoreFitContent.add(e.column.name);
    }
    this.ignoreFitContent.forEach((value) => {
      console.log('value::::::', value);
    });
    const resizedCol = this.columns.find((c) => {
      return c.name === e.column.name;
    });
    console.log('resizedCol::::::', resizedCol);
    resizedCol.minWidth = 0;
    // console.log('this.columns::::::', this.columns);
    console.log('e::::::resize', e);
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
    const arr = this.array_move(this.columns, event.prevValue, event.newValue);
    this.setLocalStorageDrag(arr);
  }

  array_move(arr, old_index, new_index) {
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

  @HostListener('pointerover', ['$event.target'])
  onPointerOver(event) {
    console.log('buttonevent', event);
  }

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.setLocalStorageRow(this.rows);
  }
  onColumnResize() {
    console.log('onColumnResize::::::');
  }
  //   ngDoCheck() {
  //     let nameCol;
  //     const value = this.ignoreFitContent.forEach((value) => {
  //       nameCol = value;
  //     });
  //     const element = this.elementRef.nativeElement as HTMLElement;
  //     const rows = element.getElementsByTagName('datatable-body-row');

  //     for (let i = 0; i < rows.length; i++) {
  //       const cells = rows[i].getElementsByTagName('datatable-body-cell');
  //       for (let k = 0; k < cells.length; k++) {
  //         this.ignoreFitContent.forEach((value) => {
  //           console.log('forEach adjustColumnMinWidth value::::::', value);
  //         });

  //         if (this.ignoreFitContent.has(this.columns[k].name)) {
  //           this.columns[k].minWidth = 0;
  //           return;
  //         }
  //         console.log('nameCol::::::', nameCol);
  //         console.log('value::::::ngDoCheck', value);
  //         console.log('ngDoCheck()');
  //       }
  //     }
  //   }

  adjustColumnMinWidth() {
    const element = this.elementRef.nativeElement as HTMLElement;
    const rows = element.getElementsByTagName('datatable-body-row');

    let columnsWidth = {};
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('datatable-body-cell');
      for (let k = 0; k < cells.length; k++) {
        this.ignoreFitContent.forEach((value) => {
          console.log('forEach adjustColumnMinWidth value::::::', value);
        });

        if (this.ignoreFitContent.has(this.columns[k].name)) {
          this.columns[k].minWidth = 0;
          return;
        }

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

  //   @HostListener('keydown', ['$event'])
  //   handleKeyDown(event: KeyboardEvent) {
  //     // console.log('event::::::, mmmmmm', event);
  //   }

  //   @HostListener('window:keypress', ['$event'])
  //   handleKeyboardEvent(event: KeyboardEvent) {
  //     console.log(event);
  //   }

  //   @HostListener('pointerover', ['$event'])
  //   onPointerOver(event) {
  // console.log(
  //   'event::::::event',
  //   event.target.getElementsByTagName('datatable-header-cell')
  // );
  // const columnTagName = event.target.getElementsByTagName(
  //   'datatable-header-cell'
  // );
  // console.log(
  //   'columnTagName::::::',
  //   columnTagName.getElementsByClassName('datatable-header-cell')
  // );
  // const resizedCol = this.columns.find((c) => {
  //   c.minWidth = 0;
  //   return c.name === 'Company';
  // });
  //   }
}

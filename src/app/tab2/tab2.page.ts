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
  AfterContentChecked,
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
  { name: 'Name', hidden: false, index: 0, width: 0, minWidth: 0 },
  { name: 'Company', hidden: false, index: 1, width: 0, minWidth: 0 },
  { name: 'Genre', hidden: false, index: 2, width: 0, minWidth: 0 },
  { name: 'Image', hidden: false, index: 3, width: 0, minWidth: 0 },
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
      {
        name: 'Name',
        hidden: false,
        draggable: false,
        dir: 'desc',
        sortable: false,
        minWidth: 0,
      },
      { name: 'Company', hidden: false, minWidth: 0 },
      { name: 'Genre', hidden: false, minWidth: 0 },
      { name: 'Image', hidden: false, minWidth: 0 },
    ];
    this.ngxResizeWatcherDirective = NgxResizeWatcherDirective;
  }

  ngOnInit(): void {
    console.log('test::::::', this.test);
    if (this.getLocalStoragSort() !== null) {
      this.sortOrder = this.getDataRowSort();
    }
    if (this.getLocalStoragDrag !== null) {
      this.columns = this.getDataRowDrag();
      console.log('this.columns:::::: down', this.columns);
    }

    if (this.getLocalStorageRow() !== null) {
      this.rows = JSON.parse(this.getLocalStorageRow());
      console.log('this.rows::::::', this.rows);
      const rowbreakLine = JSON.parse(this.getLocalStorageRow()).map((row) => {
        console.log('row::::::', row.name);
        const aaa = row.name.replace(new RegExp('\n', 'g'), '<br/>');
        return aaa;
      });
      console.log('rowbreakLine::::::', rowbreakLine);
      console.log('this.getLocalStorageRow()::::::', this.getLocalStorageRow());
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

    // this.tempColumns =
    this.columns = this.columns.filter((col) => {
      // return !col.hidden;
      const colomnName = col.name;
      console.log('colomnName::::::', colomnName);
      const isHidden = this.columnVisibility.find(
        (visibilityCol) => visibilityCol.name === colomnName
      ).hidden;
      return !isHidden;
    });
    console.log(window, 'column');
    window.dispatchEvent(new Event('resize'));
    console.log(
      'window.dispatchEvent(new Event(resize));::::::',
      window.dispatchEvent(new Event('resize'))
    );
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
      // return !col.hidden;
      const colomnName = col.name;
      const isHidden = this.columnVisibility.find(
        (visibilityCol) => visibilityCol.name === colomnName
      ).hidden;
      return !isHidden;
    });
    console.log('this.columns::::::toggleme', this.columns);
    console.log('updateColumns::::::', updateColumns);
    this.setLocalStorageColumnVisibility(updateColumns);
    // console.log('toggleName::::::', toggleName);
    // console.log('this.columns::::::', this.columns);
    // const updateColumns2 = this.columns.map((column) => {
    //   console.log('column:name:::::', column.name);
    //   console.log('toggleName::::::', toggleName);
    //   const isSame = column.name === toggleName;
    //   console.log('column::::before::', column);
    //   console.log('isSame::::::', isSame);
    //   if (isSame) {
    //     console.log('column.hidden::::::', column.hidden.toString());
    //     console.log('column.hidden:::typeof:::', typeof column.hidden);
    //     const newValue = !column.hidden;
    //     console.log('newValue::::::', newValue);
    //     column.hidden = newValue;
    //   }
    //   console.log('column::AFTER::::', column);
    //   return column;
    // });
    // console.log('updateColumns2::::::', updateColumns2);
    // this.columns = updateColumns2.filter((col) => !col.hidden);
    // this.setLocalStorageChages(updateColumns2);
    // ;
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
    return localStorage.setItem('drag', JSON.stringify(data));
  }

  getLocalStoragDrag() {
    return localStorage.getItem('drag');
  }

  test(col) {
    this.columns.map((column) => {
      console.log('column::::::', column);
      console.log('col::::::', col);
      if (column.name === col) {
        return column.width;
      }
    });
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
  // test: any = [];
  rearrange(event) {
    console.log('event::::::', event);
    // this.columns === this.columnVisibility
    const arr = this.array_move(
      this.columnVisibility,
      event.prevValue,
      event.newValue
    );
    console.log('arr::::::', arr);
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
    const rows = element.getElementsByTagName('datatable-body-row');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('datatable-body-cell');
      for (let k = 0; k < cells.length; k++) {
        const cell = cells[k];
        const cellSizer = cell.children[0].children[0].children[0] as Node;
        var text = document.querySelector('.test34').childNodes[0];
        console.log('text::::::', text);
        var range = document.createRange();
        range.selectNode(cellSizer);
        var rect = range.getBoundingClientRect().width;
        range.detach();

        console.log(
          'this.columns[k].minWidth::::::',
          this.columns[k].minWidth,
          'rect::::::',
          rect,
          this.columns[k].minWidth < rect
        );
        if (this.columns[k].minWidth < rect) {
          this.columns[k].minWidth = rect;
        }
        // if (this.columns[k].minWidth > rect) {
        //   this.columns[k].minWidth = rect;
        // }
        //   if (Math.round(this.columns[k].minWidth) !== Math.round(rect)) {
        //   this.columns[k].minWidth = rect;
        //   this.columns[k].width = rect;
        // }
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

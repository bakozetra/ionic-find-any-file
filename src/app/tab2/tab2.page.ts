import { HttpClient } from '@angular/common/http';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

export interface Data {
  movies: string;
}
const INITIALCOLUMNS = [
  { name: 'Name', hidden: false, index: 0 },
  { name: 'Company', hidden: false, index: 1 },
  { name: 'Genre', hidden: false, index: 2 },
  { name: 'Image', hidden: false, index: 3 },
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

  constructor(private http: HttpClient) {
    this.tempColumns = INITIALCOLUMNS;
    this.columns = [
      {
        name: 'Name',
        hidden: false,
        draggable: false,
        dir: 'desc',
        sortable: false,
      },
      { name: 'Company', hidden: false },
      { name: 'Genre', hidden: false },
      { name: 'Image', hidden: false },
    ];
    // this.http.get<Data>('../../assets/movies.json').subscribe((res) => {
    //   console.log(res, 'resss');
    //   this.rows = res.movies;
    //   // this.test = this.rows;
    // });
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

    // this.tempColumns = ;
    this.columns = this.columns.filter((col) => {
      // return !col.hidden;
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
  test: any = [];
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
}

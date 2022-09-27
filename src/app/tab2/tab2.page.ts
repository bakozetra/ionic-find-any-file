import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

export interface Data {
  movies: string;
}
const INITIALCOLUMNS = [
  { name: 'Name', hidden: false, draggable: false },
  { name: 'Company', hidden: false, draggable: false },
  { name: 'Genre', hidden: false, draggable: false },
  { name: 'Image', hidden: false, draggable: false },
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
  editing = {};

  constructor(private http: HttpClient) {
    this.tempColumns = INITIALCOLUMNS;
    this.columns = [
      { name: 'Name', hidden: false, draggable: false },
      { name: 'Company', hidden: false, draggable: false },
      { name: 'Genre', hidden: false, draggable: false },
      { name: 'Image', hidden: false, draggable: false },
    ];
    // this.http.get<Data>('../../assets/movies.json').subscribe((res) => {
    //   console.log(res, 'resss');
    //   this.rows = res.movies;
    //   // this.test = this.rows;
    // });
  }

  ngOnInit(): void {
    this.tempColumns = this.getDataCoumnChanges();
    this.columns = this.tempColumns.filter((col) => !col.hidden);
    console.log('test::::::', this.test);

    if (this.getLocalStorageRow() !== null) {
      console.log('not change');
      this.rows = JSON.parse(this.getLocalStorageRow());
    } else {
      this.http.get<Data>('../../assets/movies.json').subscribe((res) => {
        console.log(res, 'resss');
        this.rows = res.movies;
      });
    }
  }

  setLocalStorageChages(data) {
    return localStorage.setItem('column-data', JSON.stringify(data));
  }
  setLocalStorageRow(data) {
    return localStorage.setItem('row-data', JSON.stringify(data));
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
    const updateColumns = this.tempColumns.map((columnName) => {
      if (columnName.name === toggleName) {
        columnName.hidden = !columnName.hidden;
      }
      return columnName;
    });
    this.columns = updateColumns.filter((col) => !col.hidden);
    this.setLocalStorageChages(updateColumns);
  }

  onSort(event) {
    console.log(event);
  }
  test: any = [];
  tet2(e) {
    console.log('e:::::: tet2', e);
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

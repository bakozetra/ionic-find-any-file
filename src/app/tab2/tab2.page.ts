import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
export interface Data {
  movies: string;
}
const INITIALCOLUMNS = [
  { name: 'Name', hidden: false },
  { name: 'Company', hidden: false },
  { name: 'Genre', hidden: false },
  { name: 'Image', hidden: false },
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
      { name: 'Name', hidden: false },
      { name: 'Company', hidden: false },
      { name: 'Genre', hidden: false },
      { name: 'Image', hidden: false },
    ];
    this.http.get<Data>('../../assets/movies.json').subscribe((res) => {
      console.log(res, 'resss');
      this.rows = res.movies;
    });
  }

  ngOnInit(): void {
    this.tempColumns = this.getDataCoumnChanges();
    this.columns = this.tempColumns.filter((col) => !col.hidden);
    console.log('this.rows:::::: ngOninit', this.rows);
  }
  setLocalStorageChages(data) {
    return localStorage.setItem('changes', JSON.stringify(data));
  }

  getlocatChanges() {
    return localStorage.getItem('changes');
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

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('this.rows::::::', this.rows);
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }
}

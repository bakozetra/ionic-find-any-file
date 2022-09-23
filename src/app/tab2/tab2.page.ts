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
    // this.setPersistPresetSearch(INITIALCOLUMNS);
  }

  setLocalStorageChages(data) {
    return localStorage.setItem('changes', JSON.stringify(data));
  }
  getlocatChanges() {
    return localStorage.getItem('changes');
  }
  getDataCoumnChanges(): any {
    let localJSON = INITIALCOLUMNS;
    const localData = this.getlocatChanges();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  toggleme(e) {
    const updateColumns = this.tempColumns.map((columnName) => {
      if (columnName.name === e) {
        columnName.hidden = !columnName.hidden;
      }
      return columnName;
    });

    this.getDataCoumnChanges();
    this.setLocalStorageChages(updateColumns);

    this.columns = updateColumns.filter((col) => !col.hidden);
  }
  onSort(event) {
    console.log(event);
  }
}

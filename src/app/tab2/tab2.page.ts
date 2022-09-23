import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
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
export class Tab2Page {
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
  isToggle = false;
  toggleme(e) {
    console.log('columns[0]::::::', this.columns[0]);

    console.log('this.tempColumns::::::', this.tempColumns);
    const updateColumns = this.tempColumns.map((a) => {
      if (a.name === e) {
        console.log('e::::::', e);
        console.log('a.name::::::', a.name);
        a.hidden = !a.hidden;
      }
      return a;
    });
    console.log('updateColumns:::::: down', updateColumns);
    this.columns = updateColumns.filter((c) => !c.hidden);
    // this.isToggle = !this.isToggle;
  }
  onSort(event) {
    console.log(event);
  }
}

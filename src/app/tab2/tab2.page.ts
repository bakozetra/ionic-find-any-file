import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
export interface Data {
  movies: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Tab2Page {
  public data: Data;
  public columns: any;
  public rows: any;
  constructor(private http: HttpClient) {
    this.columns = [
      { name: 'Name' },
      { name: 'Company' },
      { name: 'Genre' },
      { name: 'Icon' },
    ];
    this.http.get<Data>('../../assets/movies.json').subscribe((res) => {
      console.log(res, 'resss');
      this.rows = res.movies;
    });
  }
  isToggle = false;

  toggleme(e) {
    if (e) {
      this.isToggle = true;
      console.log('this.isToggle:::::: if', this.isToggle);
      this.columns = [{ name: 'Company' }, { name: 'Genre' }, { name: 'Icon' }];
    }
    console.log('!this.isToggle::::::', !this.isToggle);
    if (!e) {
      this.isToggle = false;
      console.log('this.isToggle:::::: else', this.isToggle);
      this.columns = [
        { name: 'Name' },
        { name: 'Company' },
        { name: 'Genre' },
        { name: 'Icon' },
      ];
    }
  }
}

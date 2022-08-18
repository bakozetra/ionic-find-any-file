import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterModel } from '../interfaces/filterModel';
import { catchError, tap } from 'rxjs/operators';
interface PresetData {
  filters: FilterModel[];
}

export class BackendCommunicationService {
  constructor(private http: HttpClient) {}

  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return;
    };
  }
  public sendQuery(filterPreset: PresetData): Observable<any> {
    console.log('filterPreset::::::', filterPreset);
    return this.http
      .post<PresetData>('api-goes-here', filterPreset, this.httpHeader)
      .pipe(catchError(this.handleError<PresetData>('Add persist')));
  }
}

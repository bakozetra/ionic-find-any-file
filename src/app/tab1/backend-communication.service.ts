import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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

  public getPresetData(): Observable<any> {
    const subject = new BehaviorSubject([
      { param1: 'FILE_NAME', param2: 'CONTAINS', param3: 'hhhh' },
      { param1: 'FILE_NAME', param2: 'CONTAINS', param3: 'aaaaaa' },
      { param1: 'TRANSCRIPTS', param2: 'IS', param3: 'aaaaaa' },
    ]);
    return subject;
  }
}

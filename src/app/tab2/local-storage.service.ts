import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  public setLocalStorageData(data, keyItem) {
    return localStorage.setItem(keyItem, JSON.stringify(data));
  }

  public getLocalStorageData(keyItem) {
    return localStorage.getItem(keyItem);
  }

  public getDataChanges(keyItem): any {
    let localJSON;
    const localData = this.getLocalStorageData(keyItem);
    console.log('localData::::::', localData);
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }
}

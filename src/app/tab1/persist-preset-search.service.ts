import { FilterModel } from '../interfaces/filterModel';

interface PresetData {
  id: string;
  filterName: string;
  filters: FilterModel[];
}

export class PersistPresetSearchService {
  constructor() {}
  public setPersistPresetSearch(data) {
    return localStorage.setItem('presetSearch', JSON.stringify(data));
  }
  public getPersistPresetSearch() {
    return localStorage.getItem('presetSearch');
  }
  public getPersistPresetSearchParsed(): PresetData[] {
    let localJSON = [];
    const localData = this.getPersistPresetSearch();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  public findInPersistanDataByFilterName(searchParamName) {
    return this.getPersistPresetSearchParsed().find(
      (f) => f?.filterName?.toLowerCase() === searchParamName.toLowerCase()
    );
  }
}

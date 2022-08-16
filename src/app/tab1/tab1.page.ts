import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FilterModel } from '../interfaces/filterModel';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import {
  AlertController,
  IonDatetime,
  ModalController,
  Platform,
} from '@ionic/angular';
import { areFiltersEqual } from '../utils';
import { fieldsHasValue } from '../utils';
import { format, parseISO, isBefore } from 'date-fns';
import { PersistPresetSearchService } from './persist-preset-search.service';

interface PresetData {
  id: string;
  filterName: string;
  filters: FilterModel[];
}
const SUB_MENU_BETWEEN_ID = 'BETWEEN';

const SUB_MENU_TEXT_TYPE_BASE = [
  {
    id: 'CONTAINS',
    name: 'Contains',
  },
  {
    id: 'IS',
    name: 'Is',
  },
  {
    id: 'IS_NOT',
    name: 'Is Not',
  },
];

const SUB_MENU_TEXT_TYPE_BEGIN_END = [
  {
    id: 'BEGIN_WITH',
    name: 'Begin With',
  },
  {
    id: 'ENDS_WITH',
    name: 'Ends With',
  },
];
const SUB_MENU_TEXT_TYPE_CONTAINS_WORDS = [
  {
    id: 'CONTAINS_WORDS',
    name: 'Contains Words',
  },
];
const SUB_MENU_DATE_TYPE_BASE = [
  {
    id: 'EXACTLY',
    name: 'Exactly',
  },
  {
    id: 'BEFORE',
    name: 'Before',
  },
  {
    id: 'AFTER',
    name: 'After',
  },
  {
    id: SUB_MENU_BETWEEN_ID,
    name: 'Between',
  },
];
const SUB_MENU_DURATION_TYPE_BASE = [
  {
    id: 'LONGER_THAN',
    name: 'Longer Than',
  },
  {
    id: 'SHORTER_THAN',
    name: 'Shorter Than',
  },
  {
    id: 'SHOW_TOTAL_DURATION_FOR_SELECTION',
    name: 'Show Total Duration For Selection',
  },
];

const initialFilterValue = {
  param1: '',
  param2: '',
  param3: '',
  param4: '',
};

const INITIALCURRENTPRESETNAME = '';
const INITIALDATEPICKERSINFO = {
  start: { open: false, formatedValue: '' },
  end: { open: false, formatedValue: '' },
};

// const INITIALDATEPICKEINFO = {
//   open: false,
//   value: '',
// };
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  searchData = [
    {
      id: 'CLIP_NOTES',
      name: 'Clip Notes',
      type: 'text',
      subMenu: [
        ...SUB_MENU_TEXT_TYPE_BASE,
        ...SUB_MENU_TEXT_TYPE_BEGIN_END,
        ...SUB_MENU_TEXT_TYPE_CONTAINS_WORDS,
      ],
    },
    {
      id: 'FRAME_NOTES',
      name: 'Frame Notes',
      type: 'text',
      subMenu: [
        ...SUB_MENU_TEXT_TYPE_BASE,
        ...SUB_MENU_TEXT_TYPE_BEGIN_END,
        ...SUB_MENU_TEXT_TYPE_CONTAINS_WORDS,
      ],
    },
    {
      id: 'TRANSCRIPTS',
      name: 'Transcripts',
      type: 'text',
      subMenu: [
        ...SUB_MENU_TEXT_TYPE_BASE,
        ...SUB_MENU_TEXT_TYPE_BEGIN_END,
        ...SUB_MENU_TEXT_TYPE_CONTAINS_WORDS,
      ],
    },
    {
      id: 'FILE_NAME',
      name: 'File Name',
      type: 'text',
      subMenu: [...SUB_MENU_TEXT_TYPE_BASE, ...SUB_MENU_TEXT_TYPE_BEGIN_END],
    },
    {
      id: 'DURATION',
      name: 'Duration',
      type: 'time',
      subMenu: SUB_MENU_DURATION_TYPE_BASE,
    },
    {
      id: 'CARD_SERIAL',
      name: 'Card Serial',
      type: 'text',
      subMenu: SUB_MENU_TEXT_TYPE_BASE,
    },
    {
      id: 'RECORDER_SERIAL',
      name: 'Recorder Serial',
      type: 'text',
      subMenu: SUB_MENU_TEXT_TYPE_BASE,
    },
    {
      id: 'SHOOTING_DATE',
      name: 'Shooting Date',
      type: 'date',
      subMenu: SUB_MENU_DATE_TYPE_BASE,
    },
    {
      id: 'CREATION_DATE',
      name: 'Creation Date',
      type: 'date',
      subMenu: SUB_MENU_DATE_TYPE_BASE,
    },
    {
      id: 'MODIFICATION_DATE',
      name: 'Modification Date',
      type: 'date',
      subMenu: SUB_MENU_DATE_TYPE_BASE,
    },
  ];

  param2List = [];
  searchFilterForm: FormGroup;
  currentPresetName = '';
  preSelectList = [];
  message: string = '';
  updated: boolean = false;
  submitted: boolean = false;
  submittedForm: boolean;
  selectedPresetId: string = '';
  presetId: string = '';
  id: string;
  isDate: boolean = false;
  modBetween: boolean = false;
  mod: boolean = false;
  isParam2Select: boolean = false;
  messageSpan = document.getElementById('message');
  dates = ['Shooting Date', 'Creation Date', 'Modification Date'];
  dateRangePickerStart = '';
  dateRangePickerEnd = '';
  persistPresetSearchService;
  alertService;
  valueInputPicker = '';
  selectMode = 'date';
  datePickersInfo = [JSON.parse(JSON.stringify(INITIALDATEPICKERSINFO))];
  // datePickerInfo = { '0': INITIALDATEPICKEINFO };
  skipOnPreselectDDLChange = false;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private alertController: AlertController,
    public modalCtrl: ModalController,
    public platform: Platform
  ) {
    this.persistPresetSearchService = new PersistPresetSearchService();
  }

  ngOnInit() {
    this.initPriceForm();
    this.updatePreselectList();
    this.onPreselectDDLChange(1);
    this.addSearch(initialFilterValue);
  }
  @ViewChild(IonDatetime) datetime: IonDatetime;
  @ViewChild('content') mymodal: ElementRef;

  // Ionic date picker

  formatDateToDisplay(date) {
    if (!date) {
      return format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'yyyy-MM-dd');
    }
    return format(parseISO(date), 'yyyy-MM-dd');
  }

  formatDateToDisplayEnd(date) {
    if (date === '') {
      return format(
        parseISO(format(new Date(2000, 6, 2), 'yyyy-MM-dd')),
        'yyyy-MM-dd'
      );
    }
    return format(parseISO(date), 'yyyy-MM-dd');
  }

  async datePickerInputOnClick(limitName, i, event) {
    console.log('event::::::', event);
    console.log('event::::::', event);
    this.datePickersInfo[i][limitName].open =
      !this.datePickersInfo[i][limitName].open;
    if (limitName == 'end') {
      if (
        !this.datePickersInfo[i].start.formatedValue &&
        !this.allSearch().controls[i].get('param3').value
      ) {
        this.datePickersInfo[i][limitName].open =
          !this.datePickersInfo[i][limitName].open;
        const notification = await this.notificationAlert(
          'Please fill out the third field!',
          ''
        );
      }
    }
  }
  isfieldsHasValue(value) {
    return fieldsHasValue(value);
  }

  dateChanged(limitName, value, i, startDateValue?: any) {
    console.log('startDateValue::::::', startDateValue);
    if (limitName === 'start') {
      const startDateFormated = new Date(value);
      const endDateFormated = new Date(
        this.datePickersInfo[i].end.formatedValue
      );
      // const isParam3Value = new Date(
      //   this.allSearch().controls[i].get('param3').value
      // );
      let isStartAfterEndDate = isBefore(endDateFormated, startDateFormated);
      // let isStartAndEndWithParam3 = isBefore(endDateFormated, isParam3Value);
      if (isStartAfterEndDate) {
        this.datePickersInfo[i].end.formatedValue = '';
      }
    }

    if (limitName === 'end') {
      this.dateRangePickerEnd = format(parseISO(value), 'yyyy-MM-dd');
    }

    this.datePickersInfo[i][limitName].open = false;
    this.datePickersInfo[i][limitName].formatedValue = format(
      parseISO(value),
      'yyyy-MM-dd'
    );
  }

  // Date picker for exatly before and after.
  datePickerInputOnClickNotBetween(i) {
    console.log('i::::::', i);
    // console.log('event:::datePickerInputOnClickNotBetween:::', event);
    console.log(
      'this.datePickersInfo[i].start.open::::::',
      this.datePickersInfo[i]
    );

    if (this.datePickersInfo[i]) {
      this.datePickersInfo[i].start.open =
        !this.datePickersInfo[i]?.start?.open;
    }
    console.log(
      'this.datePickersInfo:::datePickerInputOnClickNotBetween:::',
      this.datePickersInfo
    );
  }

  dateChangedInputPicker(i, value, event?) {
    console.log('value:::::dateChangedInputPicker:', value);
    this.datePickersInfo[i].start.formatedValue = format(
      parseISO(value),
      'yyyy-MM-dd'
    );
    this.datePickersInfo[i].start.open = false;
    // const startDateFormated = new Date(value);
    // const endDateFormated = new Date(
    //   this.allSearch().controls[i].get('param4').value
    // );
    // let isStartAfterEndDate = isBefore(endDateFormated, startDateFormated);
    // console.log('isStartAfterEndDate::::::', isStartAfterEndDate);
    // if (isStartAfterEndDate) {
    //   this.datePickersInfo[i].end.formatedValue = '';
    //   this.allSearch().controls[i].get('param4').setValue('');
    //   if (value === '') {
    //     console.log('endDateFormated:::endDateFormated:::', endDateFormated);
    //   }
    // }
    // if()
    // I need to add if the param3 is empty then clear param4
    const row = this.allSearch().controls[i] as FormGroup;
    console.log('row::::::', row);
    console.log(
      'row.value.param2.toLowerCase()::::::',
      row.value.param2.toLowerCase()
    );
    if (row.value.param2.toLowerCase() !== SUB_MENU_BETWEEN_ID) {
      console.log('this.datePickersInfo[i]::::::', this.datePickersInfo[i]);
      if (this.datePickersInfo[i]) {
        this.datePickersInfo[i].end.formatedValue = '';
        this.allSearch().controls[i].get('param4').setValue('');
      }
    }
  }

  get f() {
    return this.searchFilterForm.controls;
  }

  addRow(flag?: boolean, rowIndex?: number, event?: any) {
    console.log('rowIndex::::::', rowIndex);
    this.submitted = false;
    this.allSearch().insert(rowIndex + 1, this.newEvent(initialFilterValue));
    // this.datePickersInfo[rowIndex + 1] = {
    //   start: { open: false, formatedValue: '' },
    //   end: { open: false, formatedValue: '' },
    // };
    const datePickerCopy = [...this.datePickersInfo];

    datePickerCopy.splice(
      rowIndex + 1,
      0,
      JSON.parse(JSON.stringify(INITIALDATEPICKERSINFO))
    );
    this.datePickersInfo = [...datePickerCopy];
    console.log('his.datePickersInfo::::::', this.datePickersInfo);
    if (flag) {
      if (this.allSearch().controls.length > 0) return;
      this.addSearch(initialFilterValue);
      return;
    }
  }

  async removeRow(index: any) {
    if (
      !Object.values(this.allSearch().get(String(index)).value).some(
        (s) => s !== ''
      )
    ) {
      this.allSearch().removeAt(index);
      return;
    }
    const confirmed = await this.confirmationAlert(
      `Are you sure to remove this row`
    );
    if (confirmed) {
      if (this.allSearch().length == 1) {
        this.allSearch().removeAt(index);
        this.UpdateSearchByRemoving(index);
        const localJSON = this.getPersistPresetSearchParsed();
        let data = localJSON.filter((ele) => ele?.id != this?.id);
        this.setPersistPresetSearch(data);
        this.updatePreselectList();
        this.currentPresetName = '';
      } else {
        this.allSearch().removeAt(index);
        this.UpdateSearchByRemoving(index);
      }
    }
  }

  async deletePreset(presetSelected, presetName, allsearch) {
    this.id = presetSelected;
    let messageSpan = document.getElementById('message');
    const localJSON = this.getPersistPresetSearchParsed();
    if (localJSON.length > 0) {
      let ele = localJSON?.find((f) => f.id == presetSelected);
      if (this.findInPersistanDataByFilterName(this.selectedPresetId) || ele) {
        let checkIfExist = localJSON.filter((ele) => {
          return ele?.id == this.id;
        });
        if (checkIfExist && checkIfExist?.length > 0) {
          const confirmed = await this.confirmationAlert(
            `Are you sure to delete : <b>${presetName}</b> preset.`
          );
          if (confirmed) {
            let data = localJSON.filter((ele) => ele?.id != this?.id);
            this.setPersistPresetSearch(data);
            messageSpan.style.color = 'red';
            this.message = `'${presetName}' is deleted successfully.`;
            if (this.message) {
              this.emptyMessageTimeout();
            }
            this.selectedPresetId = INITIALCURRENTPRESETNAME;
            this.currentPresetName = INITIALCURRENTPRESETNAME;
            allsearch.clear();
            this.updatePreselectList();
            this.addSearch(initialFilterValue);
          }
        }
      } else {
        messageSpan.style.color = 'red';
        this.message = 'Preset does not exist.';
        if (this.message) {
          setTimeout(() => {
            this.message = '';
          }, 5000);
        }
      }
    } else {
      messageSpan.style.color = 'red';
      this.message = `Preset does not exist.`;
    }
  }

  UpdateSearchByRemoving(index: any) {
    const localJSON = this.getPersistPresetSearchParsed();
    if (localJSON && localJSON[this.currentPresetName]) {
      const temp1 = localJSON[this.currentPresetName];
      temp1.splice(index, 1);
      if (temp1.length > 0) {
        this.setPersistPresetSearch(localJSON);
      } else {
        delete localJSON[this.currentPresetName];
        this.setPersistPresetSearch(localJSON);
      }
      this.updatePreselectList();
      for (let i = 0; i < this.allSearch().length; i++) {
        this.onParam1Change(i);
      }
    }
  }

  clearObject() {
    const len = this.allSearch().length;
    for (let index = 0; index <= len + 1; index++) {
      this.allSearch().removeAt(index);
    }
    this.allSearch().clear();
    this.addSearch(initialFilterValue);
  }

  async clearFilter() {
    let selectedData = this.getPersistPresetSearchParsed().filter((s) => {
      return s.filterName == this.currentPresetName;
    });
    let temp1 = selectedData[0]?.filters || [];
    const temp2 = this.searchFilterForm.value.search;
    const areEqual = areFiltersEqual(temp1, temp2);

    if (areEqual) {
      const confirmed = await this.confirmationAlert(
        `Do you want to clear the current preset: <b>${this.currentPresetName}</b>`
      );
      if (confirmed) {
        this.clearObject();
      }
      return;
    }
    if (!areEqual) {
      const confirmed = await this.confirmationAlert(
        `Do you want to clear preset including your unsaved changes : <b>${this.currentPresetName}</b>`
      );
      if (confirmed) {
        this.clearObject();
      }
      return;
    }
  }

  applyFilter() {
    alert('Apply filter.');
  }

  initPriceForm() {
    this.searchFilterForm = this.fb.group({
      search: this.fb.array([]),
    });
  }

  newEvent(item?): FormGroup {
    return this.fb.group({
      param1: [item?.param1, [Validators.required]],
      param2: [
        { value: item?.param2, disabled: item?.param2 ? false : true },
        [Validators.required],
      ],
      param3: [
        {
          value: item?.param3,
          disabled: item?.param3 ? false : true,
        },
        [Validators.required],
      ],
      param4: [
        {
          value: item?.param4,
          disabled: item?.param4 ? false : true,
        },
      ],
    });
  }

  allSearch(): FormArray {
    return this.searchFilterForm.get('search') as FormArray;
  }

  addSearch(item: any) {
    this.allSearch().push(this.newEvent(item));
    if (item.param3 && item.param4) {
      const dateIndex = this.allSearch().value.length - 1;
      if (!this.datePickersInfo[dateIndex]) {
        this.datePickersInfo[dateIndex] = JSON.parse(
          JSON.stringify(INITIALDATEPICKERSINFO)
        );
      }
      this.datePickersInfo[dateIndex].end.formatedValue = item?.param4;
      this.datePickersInfo[dateIndex].start.formatedValue = item?.param3;
    }
    if (item.param2 == 'EXACTLY' || 'AFTER' || 'BEFORE') {
      const dateIndex = this.allSearch().value.length - 1;
      if (!this.datePickersInfo[dateIndex]) {
        this.datePickersInfo[dateIndex] = JSON.parse(
          JSON.stringify(INITIALDATEPICKERSINFO)
        );
      }
      this.datePickersInfo[dateIndex].start.formatedValue = item?.param3;
    }
  }

  clearFormArray() {
    (this.searchFilterForm.controls['search'] as FormArray)?.clear();
  }

  onParam1Change(i: any) {
    if (i == 0) {
      this.isParam2Select = true;
    }
    const row = this.allSearch().controls[i] as FormGroup;
    const menu = this.searchData.find(
      (f) => f.id.toLowerCase() === row.get('param1').value.toLowerCase()
    );
    row.get('param2').enable();
    row.get('param3').enable();
    row.get('param4').enable();
    console.log('this.param2List::::::', this.param2List);
    console.log('this.param2List.length::::::', this.param2List.length);
    // if (this.param2List && this.param2List.length > 0) {
    this.param2List[i] = menu?.subMenu;
    // } else {
    //   this.param2List.push(menu?.subMenu);
    // }

    row.get('param2').markAllAsTouched();
    row.get('param2').markAsDirty();
    row.get('param2')?.setValue(this?.param2List[i][0]?.id);
    if (row.value.param2.toLowerCase() === 'exactly') {
      if (isNaN(Date.parse(row.value.param3))) {
        this.allSearch().controls[i].get('param3').setValue('');
      } else {
        return row.value.param3;
      }
    }
  }

  onParam2Change(i: any, isUserInteraction?: any) {
    const row = this.allSearch().controls[i] as FormGroup;
    console.log('this.datePickersInfo[i]::::::', this.datePickersInfo[i]);
    // if (this.datePickersInfo[i]) {
    //   this.datePickersInfo[i].end.formatedValue = '';
    //   this.allSearch().controls[i].get('param4').setValue('');
    // }

    if (row.value.param2.toLowerCase() === SUB_MENU_BETWEEN_ID) {
      if (isNaN(Date.parse(row.value.param3))) {
        isUserInteraction &&
          this.allSearch().controls[i].get('param3').setValue('');
      } else {
        return row.value.param3;
      }
    }
  }

  findParamById(formControl) {
    const param = this.searchData.find(
      (f) =>
        f.id.toLowerCase() ===
        this.allSearch().controls[formControl]?.value?.param1?.toLowerCase()
    );
    return param;
  }

  isDateType(formControl) {
    const param1Obj = this.findParamById(formControl);
    if (!param1Obj) return false;
    return param1Obj.type === 'date';
  }

  isDestinationNeeded(formControl) {
    const param1Obj = this.findParamById(formControl);
    if (!param1Obj) return false;
    return (
      param1Obj.id === 'MODIFICATION_DATE' || 'SHOOTING_DATE' || 'CREATION_DATE'
    );
  }

  async getValue(event: any, fc: any) {
    let param1DurationObj =
      this.searchFilterForm.value.search[0].param1 === 'DURATION';
    if (param1DurationObj) {
      let value = event.target.value;
      if (value.length === 1 && parseInt(value) != NaN) {
        this.allSearch()
          .controls[fc].get('param3')
          .setValue(value + 'h');
      } else if (
        value.split('h').length > 1 &&
        value.split('m').length < 2 &&
        parseInt(value.split('h')[1]) != NaN
      ) {
        this.allSearch()
          .controls[fc].get('param3')
          .setValue(value + 'm');
      } else if (
        value.split('m').length > 1 &&
        value.split('s').length < 2 &&
        parseInt(value.split('m')[1]) != NaN
      ) {
        this.allSearch()
          .controls[fc].get('param3')
          .setValue(value + 's');
      } else {
        const notification = await this.notificationAlert(
          'The Duration should be HH MM SS and 24h clock.',
          ''
        );
        return notification;
      }
    }
  }

  async savePreselectForm(
    localjson,
    searchFilterForm,
    preSelectList,
    prestName
  ) {
    this.submitted = true;
    if (!this.allSearch().valid) {
      const notification = await this.notificationAlert(
        'all field need to be filled.',
        'Please check the form.'
      );
      this.currentPresetName = '';
      return notification;
    }
    let filterData: FilterModel[] = searchFilterForm.value
      .search as FilterModel[];
    let every = filterData.every(
      (m) =>
        fieldsHasValue(m.param1) &&
        fieldsHasValue(m.param2) &&
        fieldsHasValue(m.param3)
    );
    let messageSpan = document.getElementById('message');
    console.log('every::::::', every);
    if (!every) {
      console.log('all filled need to be filled');
    }
    if (every) {
      const localJSON = localjson;
      if (
        localJSON?.length > 0 &&
        localJSON.filter((s) => s.filterName == prestName)?.length > 0
      ) {
        const temp1 = localJSON.map((data) =>
          data?.id === this.id ? data?.filters : ''
        )[0];
        const temp2 = searchFilterForm.value.search;
        if (JSON.stringify(temp1) === JSON.stringify(temp2)) {
          this.message = 'Your Filter stored successfully';
          if (this.message) {
            this.emptyMessageTimeout();
          }
          return;
        } else {
          const notification = await this.notificationAlert(
            'Preset already exists.',
            'Please check the name'
          );
          await this.open(this.mymodal);
          return;
        }
      }
      if (!preSelectList || preSelectList.length === 0) {
        const allFilters = [];
        filterData = filterData.filter(
          (data) => data?.param1 && data?.param2 && data?.param3
        );
        const finalData = {
          id: this.presetId ? this.presetId : UUID.UUID(),
          filterName: prestName,
          filters: searchFilterForm.value.search,
        };

        if (finalData.filters[0]?.param2 !== SUB_MENU_BETWEEN_ID) {
          console.log('heloo if');
        }

        if (finalData.filters[0]?.param2 === SUB_MENU_BETWEEN_ID) {
          if (finalData.filters[0]?.param4 !== '') {
            allFilters.push(finalData);
            this.setPersistPresetSearch(allFilters);
            this.updatePreselectList();
            messageSpan.style.color = 'green';
            this.message = 'Your Filter stored successfully.';
            if (this.message) {
              this.emptyMessageTimeout();
            }
          } else {
            const notification = await this.notificationAlert(
              'Both field for the between range has to be valid.',
              'Please check the form'
            );
            this.currentPresetName = '';
            return notification;
          }
        } else {
          allFilters.push(finalData);
          this.setPersistPresetSearch(allFilters);
          this.updatePreselectList();
          messageSpan.style.color = 'green';
          this.message = 'Your Filter stored successfully.';
          if (this.message) {
            this.emptyMessageTimeout();
          }
        }
      } else {
        const allFilters = preSelectList;
        filterData = filterData.filter(
          (data) => data?.param1 && data?.param2 && data?.param3
        );
        const finalData = {
          id: UUID.UUID(),
          filterName: prestName,
          filters: searchFilterForm.value.search,
        };
        if (finalData.filters[0]?.param2 !== SUB_MENU_BETWEEN_ID) {
          console.log('heloo else');
        }

        if (finalData.filters[0]?.param2 === SUB_MENU_BETWEEN_ID) {
          console.log('heloo else');
          if (finalData.filters[0]?.param4 !== '') {
            allFilters.push(finalData);
            this.setPersistPresetSearch(allFilters);
            this.updatePreselectList();
            messageSpan.style.color = 'green';
            this.message = 'Your Filter stored successfully.';
            if (this.message) {
              this.emptyMessageTimeout();
            }
          } else {
            const notification = await this.notificationAlert(
              'Both field for the between range has to be valid.',
              'Please check the form'
            );
            this.currentPresetName = '';
            return notification;
          }
        } else {
          allFilters.push(finalData);
          this.setPersistPresetSearch(allFilters);
          this.updatePreselectList();
          messageSpan.style.color = 'green';
          this.message = 'Your Filter stored successfully.';
          if (this.message) {
            this.emptyMessageTimeout();
          }
        }
      }
    }
  }

  emptyMessageTimeout() {
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  async updateCurrentPreset() {
    let filterModel = this.searchFilterForm;
    let allsearch = this.allSearch();
    let findInPersistanDataByFilterName = this.findInPersistanDataByFilterName(
      this.currentPresetName
    );
    let preselectList = this.preSelectList;
    let presetsName = this.currentPresetName;
    this.submitted = true;
    let filterData: FilterModel[] = filterModel.value.search as FilterModel[];
    if (!allsearch.valid) {
      return;
    }
    // to check if the forth is empty

    for (var i = 0, len1 = filterData.length; i < len1; i++) {
      if (!fieldsHasValue(filterData?.[i]?.param3) && filterData?.[i]?.param3) {
        filterData[i].param3 = '';
      }

      if (
        filterData?.[i]?.param4 == '' &&
        filterData?.[i]?.param2 === SUB_MENU_BETWEEN_ID
      ) {
        const notification = await this.notificationAlert(
          'Both field for the between range has to be valid.',
          'Please check the form'
        );
        // return notification;
        this.currentPresetName = '';
      }
    }

    let every = filterData.every((m) => {
      return (
        fieldsHasValue(m.param1) &&
        fieldsHasValue(m.param2) &&
        fieldsHasValue(m.param3)
      );
    });
    let messageSpan = document.getElementById('message');
    let isModified = true;
    if (every) {
      let temp = findInPersistanDataByFilterName;
      if (temp) {
        let temp1 = temp.filters;
        const temp2 = filterModel.value.search;
        for (var i = 0, len1 = temp1.length as number; i < len1; i++) {
          if (
            temp1?.[i]?.param4 == '' &&
            temp1?.[i]?.param2 !== SUB_MENU_BETWEEN_ID
          ) {
            delete temp1[i].param4;
          }
        }
        for (var i = 0, len2 = temp2.length; i < len2; i++) {
          if (
            temp2?.[i]?.param4 == '' &&
            temp1?.[i]?.param2 !== SUB_MENU_BETWEEN_ID
          ) {
            delete temp2[i].param4;
          }
        }
        // debugger;
        if (JSON.stringify(temp1) === JSON.stringify(temp2)) {
          messageSpan.style.color = 'green';
          this.message = 'Your Filter stored successfully';
          if (this.message) {
            this.emptyMessageTimeout();
          }
          return;
        } else {
          const confirmed = await this.confirmationAlert(
            `Your are updating the current filter: <b>${presetsName}</b>  
              <p>Please confirm.</p>`
          );
          if (!confirmed) {
            return;
          }
          isModified = confirmed;
        }
      }

      if (preselectList.some((s) => s.filterName === presetsName)) {
        const message = isModified
          ? 'Your filter updated successfully.'
          : 'Your Filter stored successfully.';

        const finalData = [
          {
            id: String(this.presetId),
            filterName: presetsName,
            filters: filterModel.getRawValue()?.search,
          },
        ];
        let data = this.getPersistPresetSearchParsed().filter(
          (ele) => ele.id != String(this.presetId)
        );

        data = [...data, ...finalData];
        this.setPersistPresetSearch(data);
        messageSpan.style.color = 'green';
        this.message = message;
        await this.emptyMessageTimeout();
        setTimeout(() => {
          this.message = '';
        }, 3000);
      }
    }
  }

  setPersistPresetSearch(data) {
    return this.persistPresetSearchService.setPersistPresetSearch(data);
  }

  getPersistPresetSearch() {
    return this.persistPresetSearchService.getPersistPresetSearch();
  }
  getPersistPresetSearchParsed() {
    return this.persistPresetSearchService.getPersistPresetSearchParsed();
  }

  findInPersistanDataByFilterName(searchParamName) {
    return this.persistPresetSearchService.findInPersistanDataByFilterName(
      searchParamName
    );
  }

  updatePreselectList() {
    var localJSON = this.getPersistPresetSearchParsed();
    this.preSelectList = localJSON;
    if (this.currentPresetName.toLowerCase()) {
      this.selectedPresetId = this.findInPersistanDataByFilterName(
        this.currentPresetName
      )?.id;
      this.presetId = this.selectedPresetId;
    }
  }

  async onPreselectDDLChange(e: any) {
    if (this.skipOnPreselectDDLChange) {
      this.skipOnPreselectDDLChange = false;
      return;
    }
    const previousPresetId = this.presetId;
    if (e === 1) {
      this.currentPresetName = INITIALCURRENTPRESETNAME;
    } else {
      const currentPreset = this.preSelectList.find((preItem) => {
        return preItem.id === e?.detail?.value;
      });
      this.currentPresetName =
        currentPreset?.filterName || INITIALCURRENTPRESETNAME;
    }
    // debugger;
    const changes = this.trackChanges(this.presetId);
    // to check if newly created presets after fresh load app should be saved
    const compareSearchParam =
      this.currentPresetName &&
      this.currentPresetName !== INITIALCURRENTPRESETNAME;
    // debugger;
    if (!changes) {
      if (compareSearchParam) {
        const confirmed = await this.confirmationAlert(
          `Do you want to discard the current filter changes`
        );
        console.log('confirmed::::::', confirmed);
        // debugger;
        if (confirmed) {
          this.selectedPresetId = e.target?.value;
        } else {
          this.selectedPresetId = this.presetId;
          this.skipOnPreselectDDLChange = true;
          return;
        }
      }
    }

    this.presetId = e.target?.value;
    this.id = e.target?.value;
    if (
      this.currentPresetName &&
      this.currentPresetName === INITIALCURRENTPRESETNAME
    ) {
      this.allSearch().clear();
    }
    console.log('compareSearchParam::::::', compareSearchParam);
    if (compareSearchParam) {
      this.clearFormArray();
      const localJSON = this.getPersistPresetSearchParsed();
      if (localJSON.length) {
        const tempArray = [] as any[];
        const currentSelection = localJSON.find((f) => f.id == this.presetId);
        currentSelection?.filters?.map((f, index) => {
          const menu = this.searchData.find(
            (fn) => fn.id.toLowerCase() === f.param1.toLowerCase()
          );
          // if (this.param2List && this.param2List.length > 0) {
          this.param2List[index] = menu?.subMenu;
          // }
          // else {
          //   this.param2List.push(menu.subMenu);
          // }
          tempArray.push({
            param1: f.param1,
            param2: f.param2,
            param3: f.param3,
            param4: f.param4 ? f.param4 : '',
          });
        });
        tempArray.map((m, i) => {
          this.addSearch(m);
          this.onParam2Change(i, false);
        });
      } else {
        this.allSearch().clear();
        this.updatePreselectList();
      }
    }
  }

  trackChanges = (param: any) => {
    console.log('param::::::', param);
    // debugger;
    if (!param) return true;
    const localJSON = this.getPersistPresetSearchParsed();
    let data = localJSON.find((f) => f.id == param);
    if (!data) {
      return false;
    }
    if (data?.filters?.length === this.allSearch().controls.length) {
      const temp1 = this.allSearch().getRawValue();
      const temp2 = data?.filters;

      for (var i = 0, len1 = temp1.length; i < len1; i++) {
        if (temp1?.[i]?.param4 == '') {
          delete temp1[i].param4;
        }
      }
      for (var i = 0, len2 = temp2.length; i < len2; i++) {
        if (temp2?.[i]?.param4 == '') {
          delete temp2[i].param4;
        }
      }
      console.log('temp1::::::', temp1);
      console.log('temp2::::::', temp2);
      console.log(
        'JSON.stringify(temp1) !== JSON.stringify(temp2)::::::',
        JSON.stringify(temp1) !== JSON.stringify(temp2)
      );
      if (JSON.stringify(temp1) !== JSON.stringify(temp2)) {
        console.log('param:::temp1:::', param);
        return false;
      } else {
        return true;
      }
    }
    return false;
  };

  closeResult = '';

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          if (
            this.closeResult !== `Dismissed ${this.getDismissReason('button')}`
          ) {
            this.currentPresetName = INITIALCURRENTPRESETNAME;
          }
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private async confirmationAlert(message: string): Promise<boolean> {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>((resolve) => {
      resolveFunction = resolve;
    });
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message,
      cssClass: 'alert-confirmation',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => resolveFunction(false),
        },
        {
          text: 'Yes',
          handler: () => resolveFunction(true),
        },
      ],
    });
    await alert.present();
    return promise;
  }
  private async notificationAlert(
    message: string,
    headertitle: string
  ): Promise<boolean> {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>((resolve) => {
      resolveFunction = resolve;
    });
    const alert = await this.alertController.create({
      header: headertitle,
      message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => resolveFunction(true),
        },
      ],
    });
    await alert.present();
    return promise;
  }
  onSelectFocus(e) {
    const elementFirstchild = e.srcElement.firstChild;
    if (this.currentPresetName === INITIALCURRENTPRESETNAME) {
      const addClassToElementChild = elementFirstchild.classList.add(
        'unfocusFirstelement'
      );
    } else {
      const addClassToElementChild = elementFirstchild.classList.remove(
        'unfocusFirstelement'
      );
    }
  }

  swapRows(currentRowIndex, targetRowIndex) {
    const datePickerInforCurrent = {
      ...this.datePickersInfo[currentRowIndex],
    };

    const datePickerInfoTarget = {
      ...this.datePickersInfo[targetRowIndex],
    };

    const previous = this.allSearch().at(targetRowIndex);
    const current = this.allSearch().at(currentRowIndex);
    this.allSearch().setControl(currentRowIndex, previous);
    this.allSearch().setControl(targetRowIndex, current);
    this.datePickersInfo[currentRowIndex] = datePickerInfoTarget;
    this.datePickersInfo[targetRowIndex] = datePickerInforCurrent;
  }
  moveUp(e, currentRowIndex) {
    const targetRowIndex = currentRowIndex - 1;
    this.swapRows(currentRowIndex, targetRowIndex);
  }

  moveDown(e, currentRowIndex) {
    const targetRowIndex = currentRowIndex + 1;
    this.swapRows(currentRowIndex, targetRowIndex);
  }

  handleClear(i) {
    if (this.allSearch().controls[i].get('param3')) {
      this.allSearch().controls[i].get('param3').setValue('');
      this.datePickersInfo[i].start.formatedValue = '';
      // } else if (this.allSearch().controls[i].get('param4')) {
      //   this.allSearch().controls[i].get('param4').setValue('');
      //   this.datePickersInfo[i].end.formatedValue = '';
      // }
      console.log('i::::::', i);
    }
  }

  handleClearFourthField(i) {
    // if (this.allSearch().controls[i].get('param3')) {
    //   this.allSearch().controls[i].get('param3').setValue('');
    //   this.datePickersInfo[i].start.formatedValue = '';
    // } else
    if (this.allSearch().controls[i].get('param4')) {
      this.allSearch().controls[i].get('param4').setValue('');
      this.datePickersInfo[i].end.formatedValue = '';
    }
    console.log('i::::::', i);
  }

  drop(event: CdkDragDrop<any>) {
    const previous = this.allSearch().at(event.previousIndex);
    const current = this.allSearch().at(event.currentIndex);
    this.allSearch().setControl(event.currentIndex, previous);
    this.allSearch().setControl(event.previousIndex, current);
    this.onParam1Change(event.currentIndex);
    this.onParam1Change(event.previousIndex);
  }
}

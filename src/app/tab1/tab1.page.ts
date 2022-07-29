import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  ViewChild,
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
import { AlertController, IonDatetime, ModalController } from '@ionic/angular';
import { areFiltersEqual } from '../utils';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,
} from 'ion2-calendar';
import { Moment } from 'moment';
import { format, parseISO, isBefore } from 'date-fns';

declare var easepick: any;

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

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private alertController: AlertController,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.initPriceForm();
    this.updatePreselectList();
    this.onPreselectDDLChange(1);
    this.addSearch(initialFilterValue);
  }
  @ViewChild(IonDatetime) datetime: IonDatetime;

  // Ionic date picker

  selectMode = 'date';
  datePickersInfo = {
    '0': { start: { open: false, value: '' }, end: { open: false, value: '' } },
  };
  showPickerEnd = false;
  dateValueEnd = format(new Date(), 'yyyy-MM-dd') + 'T09:00:00.000Z';
  formatedstringEnd = '';
  formatDateToDisplay(date) {
    console.log('date::::::', date);

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

  datePickerInputOnClick(limitName, i, event) {
    console.log('event::::::', event);
    this.datePickersInfo[i][limitName].open =
      !this.datePickersInfo[i][limitName].open;
  }
  datePickerInputClose(limitName, i) {
    this.datePickersInfo[i][limitName].open =
      this.datePickersInfo[i][limitName].open;
  }

  dateChanged(limitName, value, i, startDateValue?: any) {
    console.log('limitName::::::', limitName, value);
    if (limitName === 'start') {
      // this.dateRangePickerStart = format(parseISO(value), 'yyyy-MM-dd');
      const startDateFormated = new Date(value);
      console.log('startDateFormated::::::', startDateFormated);
      const endDateFormated = new Date(
        this.datePickersInfo[i].end.formatedValue
      );
      console.log('endDateFormated::::::', endDateFormated);
      let isStartAfterEndDate = isBefore(endDateFormated, startDateFormated);
      console.log('isStartAfterEndDate::::::', isStartAfterEndDate);

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

  //  ngx calender
  async openCalendar() {
    console.log('openCalendar::::::');
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'Pick date between',
      showYearPicker: true,
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options },
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date = event?.data;
    const from: CalendarResult = date?.from;
    const to: CalendarResult = date?.to;
    console.log(date, from, to);
    console.log(date, from?.string, to?.string);
    // this.dateRangePickerStart = from?.string;
    // this.dateRangePickerEnd = to?.string;
  }

  title = 'angular-ngx-daterangepicker-material-app';
  selected: {
    startDate: Moment;
    endDate: Moment;
  };
  // easipick calender
  createDateRangePicker(i, date?: any) {
    const presetDate = date && date.param3 ? date.param3.split(' - ') : [];
    // const presetDateParm4 = date && date.param3 ? date.param4.split(' - ') : [];

    const picker = new easepick.create({
      element: '#datepicker' + i,
      css: [
        'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css',
      ],
      zIndex: 99,
      plugins: ['AmpPlugin', 'RangePlugin'],
    });

    // picker.on('select', (date) => {
    //   this.allSearch().controls[i].get('param3').setValue(
    //     date.detail.start.toLocaleString().split(',')[0]
    //     // +date.detail.end.toLocaleString().split(',')[0]
    //   );
    // });
    // picker.on('select', (date) => {
    //   console.log('date::: date:::', date);
    //   this.allSearch().controls[i].get('param4').setValue(
    //     // date.detail.start.toLocaleString().split(',')[0] + ' - '
    //     date.detail.end.toLocaleString().split(',')[0]
    //   );
    // });
    // picker.on('show', () => {
    //   let startDate = presetDate[0] ? new Date(presetDate[0]) : new Date();
    //   console.log('startDate::::::', startDate);
    //   // let endDate = presetDate[1] ? new Date(presetDate[1]) : new Date();
    //   if (startDate) {
    //     startDate.setMonth(startDate.getMonth());
    //     picker.setDateRange(startDate);
    //   }
    // });
  }
  get f() {
    return this.searchFilterForm.controls;
  }
  addRow(flag?: boolean, rowIndex?: number, event?: any) {
    this.submitted = false;
    this.allSearch().insert(rowIndex + 1, this.newEvent(initialFilterValue));
    this.datePickersInfo[rowIndex + 1] = {
      start: { open: false, value: '' },
      end: { open: false, value: '' },
    };
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
            `Are you sure to delete ${presetName} preset.`
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
        'Do you want to clear the current preset: ' + this.currentPresetName
      );
      if (confirmed) {
        this.clearObject();
      }
      return;
    }
    if (!areEqual) {
      const confirmed = await this.confirmationAlert(
        'Do you want to clear preset including your unsaved changes : ' +
          this.currentPresetName
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
    console.log('item::::::', item);
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
        // [Validators.required],
      ],
    });
  }

  allSearch(): FormArray {
    return this.searchFilterForm.get('search') as FormArray;
  }

  addSearch(item: any) {
    console.log('item::::addSearch::', item);
    this.allSearch().push(this.newEvent(item));
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

    if (this.param2List && this.param2List.length > 0) {
      this.param2List[i] = menu?.subMenu;
    } else {
      this.param2List.push(menu?.subMenu);
    }

    row.get('param2').markAllAsTouched();
    row.get('param2').markAsDirty();
    row.get('param2')?.setValue(this?.param2List[i][0]?.id);
  }

  onParam2Change(i: any, data?: any) {
    // debugger
    console.log('data::onParam2Change::::', data);
    console.log('i::::onParam2Change::', i);
    const row = this.allSearch().controls[i] as FormGroup;
    console.log(
      'row.value.param2.toLowerCase() === BETWEEN.toLowerCase()::::::',
      row.value.param2.toLowerCase() === SUB_MENU_BETWEEN_ID.toLowerCase()
    );
    if (row.value.param2.toLowerCase() === SUB_MENU_BETWEEN_ID.toLowerCase()) {
      // setTimeout(() => {
      //   this.createDateRangePicker(i, data);
      // }, 100);
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
      console.log('param1DurationObj::::::', param1DurationObj);
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
      return;
    }
    let filterData: FilterModel[] = searchFilterForm.value
      .search as FilterModel[];
    let every = filterData.every(
      (m) => m.param1 !== '' && m.param2 !== '' && m.param3 !== ''
    );
    let messageSpan = document.getElementById('message');
    if (every) {
      const localJSON = localjson;
      if (
        localJSON?.length > 0 &&
        localJSON.filter((s) => s.filterName == prestName)?.length > 0
      ) {
        const temp1 = localJSON.map((data) =>
          data?.id === this.id ? data?.filters : ''
        )[0];
        console.log('temp1::::::', temp1);
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
          return notification;
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

        allFilters.push(finalData);
        this.setPersistPresetSearch(allFilters);
        this.updatePreselectList();
        messageSpan.style.color = 'green';
        this.message = 'Your Filter stored successfully.';
        if (this.message) {
          this.emptyMessageTimeout();
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
        console.log('finalData:::else:::', finalData.filters);
        console.log('finalData:::else::: param2', finalData.filters[0]?.param2);
        if (finalData.filters[0]?.param2 === SUB_MENU_BETWEEN_ID) {
          if (finalData.filters[0]?.param4 !== '') {
            console.log('this is the test');
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
    console.log('allsearch::::::', allsearch);
    console.log('allsearch.valid::::::', allsearch.valid);
    console.log(
      'searchFilterForm.value.search::::::',
      this.searchFilterForm.value.search
    );

    this.submitted = true;
    let filterData: FilterModel[] = filterModel.value.search as FilterModel[];

    if (!allsearch.valid) {
      console.log('allsearch.valid:::updateCurrentPreset:::', allsearch.valid);
      return;
    }
    console.log('findInPersistanDataByFilterName::::::', {
      ...filterData,
    });

    for (var i = 0, len1 = filterData.length; i < len1; i++) {
      console.log(
        'findInPersistanDataByFilterName.filters?.[i]?.param4::::::',
        filterData?.[i]?.param4
      );
      console.log('filterData?.[i]?.param3::::::', filterData?.[i]?.param3);
      console.log('filterData?.[i]?.param2::::::', filterData?.[i]?.param2);
      if (
        filterData?.[i]?.param4 == '' ||
        (!filterData?.[i]?.param4 &&
          filterData?.[i]?.param2 === SUB_MENU_BETWEEN_ID)
      ) {
        const notification = await this.notificationAlert(
          'Both field for the between range has to be valid.',
          'Please check the form'
        );
        return notification;
      }
    }
    let every = filterData.every(
      (m) => m.param1 !== '' && m.param2 !== '' && m.param3 !== ''
    );
    let messageSpan = document.getElementById('message');
    let isModified = true;
    if (every) {
      console.log('every::::::', every);
      let temp = findInPersistanDataByFilterName;
      if (temp) {
        console.log('temp::::::', temp);
        let temp1 = temp.filters;
        const temp2 = filterModel.value.search;
        for (var i = 0, len1 = temp1.length; i < len1; i++) {
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
            'Your are updating the current filter: ' +
              presetsName +
              ' Please confirm'
          );
          console.log('confirmed::::::', confirmed);
          if (!confirmed) {
            return;
          }
          isModified = confirmed;
        }
      }

      if (preselectList.some((s) => s.filterName === presetsName)) {
        console.log('isModified::::::', isModified);
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
        console.log(
          'finalData::::bbbb::',
          finalData.map((a) => a.filters)
        );
        let filterInBetween = finalData.map((a) => {
          let test1 = a.filters;
          test1?.filter((bb) => bb?.param2 === SUB_MENU_BETWEEN_ID);
          if (test1) {
            console.log('test1::::::', test1);
          }
        });
        console.log('filterInBetween::::::', filterInBetween);
        // "BETWEEN"

        data = [...data, ...finalData];
        console.log('data::::::', data);
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
    localStorage.setItem('presetSearch', JSON.stringify(data));
  }
  getPersistPresetSearch() {
    return localStorage.getItem('presetSearch');
  }
  getPersistPresetSearchParsed(): PresetData[] {
    let localJSON = [];
    const localData = this.getPersistPresetSearch();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  findInPersistanDataByFilterName(searchParamName) {
    return this.getPersistPresetSearchParsed().find(
      (f) => f?.filterName?.toLowerCase() === searchParamName
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

  onPreselectDDLChange(e: any) {
    if (e === 1) {
      this.currentPresetName = INITIALCURRENTPRESETNAME;
    } else {
      const currentPreset = this.preSelectList.find((preItem) => {
        return preItem.id === e?.detail?.value;
      });
      this.currentPresetName =
        currentPreset?.filterName || INITIALCURRENTPRESETNAME;
    }

    const changes = this.trackChanges(this.presetId);
    // to check if newly created presets after fresh load app should be saved
    const compareSearchParam =
      this.currentPresetName &&
      this.currentPresetName !== INITIALCURRENTPRESETNAME;
    if (!changes) {
      if (compareSearchParam) {
        if (!confirm('Do you want to discard the current filter changes')) {
          setTimeout(() => {
            this.selectedPresetId = this.presetId;
          }, 100);
          return;
        }
      }
    }
    this.id = e.target?.value;
    this.presetId = e.target?.value;
    if (
      this.currentPresetName &&
      this.currentPresetName === INITIALCURRENTPRESETNAME
    ) {
      this.allSearch().clear();
    }

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
          if (this.param2List && this.param2List.length > 0) {
            this.param2List[index] = menu?.subMenu;
          } else {
            this.param2List.push(menu.subMenu);
          }
          tempArray.push({
            param1: f.param1,
            param2: f.param2,
            param3: f.param3,
            param4: f.param4 ? f.param4 : '',
          });
        });
        tempArray.map((m, i) => {
          this.addSearch(m);
          this.onParam2Change(i, m);
        });
      } else {
        this.allSearch().clear();
        this.updatePreselectList();
      }
    }
  }

  trackChanges = (param: any) => {
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

      if (JSON.stringify(temp1) !== JSON.stringify(temp2)) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  };

  closeResult = '';

  open(content) {
    console.log('content::::::', content);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    console.log('reason::::::', reason);
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

  drop(event: CdkDragDrop<any>) {
    const previous = this.allSearch().at(event.previousIndex);
    const current = this.allSearch().at(event.currentIndex);
    this.allSearch().setControl(event.currentIndex, previous);
    this.allSearch().setControl(event.previousIndex, current);
    this.onParam1Change(event.currentIndex);
    this.onParam1Change(event.previousIndex);
  }
}

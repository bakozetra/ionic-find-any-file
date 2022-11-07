import { ItemReorderEventDetail, Platform } from '@ionic/angular';
import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  NgZone,
  ElementRef,
  HostListener,
  OnDestroy,
  AfterViewChecked,
  AfterViewInit,
} from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import {
  forceFillColumnWidths,
  adjustColumnWidths,
} from '@swimlane/ngx-datatable';
import { NgxResizeWatcherDirective } from './checkerDirective.service';

export interface Data {
  movies: string;
}
const INITIALCOLUMNS = [
  { name: 'Name', hidden: false, minWidth: 0 },
  { name: 'Company', hidden: false, minWidth: 0 },
  { name: 'Genre', hidden: false, minWidth: 0 },
  { name: 'Image', hidden: false, minWidth: 0 },
];
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Tab2Page implements OnInit {
  // scrollcontent($event: any) {
  //   console.log('$event::::::scrollcontent', $event);
  // }
  // allowDrop($event: DragEvent) {
  //   console.log('$event::::::allowDrop', $event);
  // }
  // ondrop($event: DragEvent) {
  //   // throw new Error('Method not implemented.');
  //   console.log('$event::::::ondrop', $event);
  // }
  public data: Data;
  public columns: any;
  public tempColumns: any;
  public rows: any;
  public sort: any;
  sortOrder = [];
  public columnVisibility;
  public ignoreFitContent = new Set([]);

  editing = {};
  ngxResizeWatcherDirective;
  rowHeight;

  constructor(
    private http: HttpClient,
    private _zone: NgZone,
    private elementRef: ElementRef,
    private platform: Platform
  ) {
    this.tempColumns = INITIALCOLUMNS;
    this.columns = [
      { name: 'Name', hidden: false, minWidth: 0 },
      { name: 'Company', hidden: false, minWidth: 0 },
      { name: 'Genre', hidden: false, minWidth: 0 },
      { name: 'Image', hidden: false, minWidth: 0 },
    ];
    this.ngxResizeWatcherDirective = NgxResizeWatcherDirective;
  }
  desktopPlatforme = this.platform.is('desktop');
  mobilePlatforme = this.platform.is('android');

  ngOnInit(): void {
    console.log('desktopPlatforme::::::', this.desktopPlatforme);
    if (this.getLocalStoragSort() !== null) {
      this.sortOrder = this.getDataRowSort();
    }
    if (this.getLocalStoragDrag !== null) {
      this.columns = this.getDataRowDrag();
      console.log('this.columns::::::this.columns', this.columns);
    }

    if (this.getLocalStorageRow() !== null) {
      this.rows = JSON.parse(this.getLocalStorageRow());
    } else {
      this.http.get<Data>('../../assets/movies.json').subscribe((res) => {
        console.log(res, 'resss');
        this.rows = res.movies;
      });
    }
    if (!this.getLocalStorageColumnVisibility()) {
      this.setLocalStorageColumnVisibility(INITIALCOLUMNS);
      this.columnVisibility = JSON.parse(JSON.stringify(INITIALCOLUMNS));
    } else {
      this.columnVisibility = this.getLocalStorageColumnVisibility();
    }

    this.columns = this.columns.filter((col) => {
      const colomnName = col.name;
      const isHidden = this.columnVisibility.find(
        (visibilityCol) => visibilityCol.name === colomnName
      ).hidden;
      return !isHidden;
    });
  }
  // @HostListener('document:scroll', ['$event']) onScoll(e) {
  //   console.log('e::::::document:scroll', e);
  // }
  // @HostListener('document:scroll', [])
  // onWindowScroll(ee) {
  //   console.log('ee::::::', ee);
  //   console.log(window.scrollY);
  // }

  @HostListener('pointerdown', ['$event']) onPointerDown(e) {
    e.stopPropagation();
    // console.log('e::::::pointerdown', e);
    // console.log('e?.target::::::', e?.target?.style.width);
    const columnName = e?.target?.parentNode?.querySelector(
      '.datatable-header-cell-label'
    )?.innerHTML;
    console.log('columnName::::::pointerdown', columnName);
    if (columnName) {
      this.ignoreFitContent.add(columnName.trim());
      const resizedCol = this.columns.find((c) => {
        console.log('c::::::c.width', c.width);
        console.log('c.name::::::', c.name, columnName);
        return c.name.trim() === columnName.trim();
      });
      // let columnWidth = e?.target?.parentNode;
      // console.log(
      //   'resizedCol.minWidth < columnWidth.style.width::::::',
      //   resizedCol.minWidth > parseInt(columnWidth.style.width)
      // );
      // console.log(
      //   'columnWidth::::::resizedCol.minWidth',
      //   resizedCol.minWidth,
      //   parseInt(columnWidth.style.width)
      // );
      // if (resizedCol.minWidth > parseInt(columnWidth.style.width)) {
      //   columnWidth.style.width = resizedCol.minWidth + 'px';
      //   columnWidth.style.minWidth = '0px';

      //   console.log(
      //     'columnWidth.style.minWidth::::::',
      //     columnWidth.style.minWidth,
      //     resizedCol.minWidth
      //   );
      // }

      // if (resizedCol.minWidth < parseInt(columnWidth.style.width)) {
      // }
      resizedCol.minWidth = 0;
    }
  }

  setLocalStorageChages(data) {
    return localStorage.setItem('column-data', JSON.stringify(data));
  }
  setLocalStorageRow(data) {
    return localStorage.setItem('row-data', JSON.stringify(data));
  }

  setLocalStorageColumnVisibility(data) {
    return localStorage.setItem('column-visibility', JSON.stringify(data));
  }

  getLocalStorageColumnVisibility() {
    return JSON.parse(localStorage.getItem('column-visibility'));
  }

  getLocalStorageRow() {
    return localStorage.getItem('row-data');
  }
  getlocatChanges() {
    return localStorage.getItem('column-data');
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
  getDataRowChanges(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStorageRow();
    console.log('localData::::::', localData);
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  toggleme(toggleName) {
    const updateColumns = this.columnVisibility.map((columnName) => {
      if (columnName.name === toggleName) {
        columnName.hidden = !columnName.hidden;
      }
      return columnName;
    });
    this.columns = updateColumns.filter((col) => {
      const colomnName = col.name;
      const isHidden = this.columnVisibility.find(
        (visibilityCol) => visibilityCol.name === colomnName
      ).hidden;
      return !isHidden;
    });

    this.setLocalStorageColumnVisibility(updateColumns);
    this.setLocalStorageDrag(updateColumns);
  }

  toggleRow(e) {
    if (e.detail.checked) {
      this.rowHeight = '80px';
    } else {
      this.rowHeight = undefined;
    }
    console.log('this.rowHeight::::::down', this.rowHeight);
  }

  setLocalStorageSort(data) {
    return localStorage.setItem('sorting', JSON.stringify(data));
  }

  resize(e) {
    console.log('e::::::resize', e);
    if (e?.column?.name) {
      this.ignoreFitContent.add(e.column.name);
      const resizedCol = this.columns.find((c) => {
        return c.name === e.column.name;
      });
      resizedCol.minWidth = 0;
      // e.column.width = e.newValue;
      console.log('e.column.width::::::', e.column.width);
    }
    // this.ignoreFitContent.forEach((value) => {
    //   console.log('value::::::resize', value);
    // });
  }

  updateFilter(e) {
    console.log('e::::::', e);
  }

  getLocalStoragSort() {
    return localStorage.getItem('sorting');
  }

  getDataRowSort(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStoragSort();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }
  setLocalStorageDrag(data) {
    console.log('data::::::setLocalStorageDrag', data);
    return localStorage.setItem('drag', JSON.stringify(data));
  }

  getLocalStoragDrag() {
    return localStorage.getItem('drag');
  }

  getDataRowDrag(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStoragDrag();
    console.log('localData::::::', localData);
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  onSort(event) {
    this.setLocalStorageSort(event.sorts);
  }
  rearrange(event) {
    console.log('event::::::rearrange', event);
    console.log('event.prevValue::::::', event.prevValue);
    console.log('event.newValue::::::', event.newValue);
    const arr = this.array_move(this.columns, event.prevValue, event.newValue);
    this.setLocalStorageDrag(arr);
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      console.log('new_index::::::', new_index);
      var k = new_index - arr.length + 1;
      console.log('k::::::', k);
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

    return arr;
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.setLocalStorageRow(this.rows);
    this.ignoreFitContent = new Set([]);
  }

  adjustColumnMinWidth() {
    console.log('adjustColumnMinWidth::::::');
    const element = this.elementRef.nativeElement as HTMLElement;
    const rows = element.getElementsByTagName('datatable-body-row');
    let columnsWidth = {};
    this.ignoreFitContent.forEach((val) => {
      console.log('val::::::', val);
    });
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('datatable-body-cell');
      for (let k = 0; k < cells.length; k++) {
        if (this.ignoreFitContent.has(this.columns[k].name)) {
          return;
        }

        const cell = cells[k];
        const cellSizer = cell.children[0].children[0].children[0].lastChild;
        console.log('cellSizer::::::', cellSizer);
        try {
          var range = document.createRange();
          range.selectNode(cellSizer);
          var rect = range.getBoundingClientRect().width;
          range.detach();
          if (!(k in columnsWidth)) {
            columnsWidth = { ...columnsWidth, [k]: 0 };
          }
          const currentColunWidth = columnsWidth[k];
          const newColumnWidth = Math.max(currentColunWidth, rect);
          columnsWidth[k] = newColumnWidth;
          this.columns[k].minWidth = newColumnWidth;
          console.log(
            'this.columns[k].minWidth::::::',
            this.columns[k].minWidth
          );
        } catch (e) {
          console.log('e::getting width error::::', e);
        }
      }
    }
    console.log('columnsWidth::::::', columnsWidth);
  }
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
  ];

  drop(event: CdkDragDrop<string[]>) {
    console.log('event::::::drop', event);
    const arr = this.array_move(
      this.columns,
      event.previousIndex,
      event.currentIndex
    );
    this.setLocalStorageDrag(arr);
  }
}

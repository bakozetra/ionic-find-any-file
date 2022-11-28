import { ItemReorderEventDetail, Platform } from '@ionic/angular';
import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import {
  CdkDragDrop,
  CdkDragMove,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
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
  { name: 'Name', hidden: false, minWidth: 0, width: 0 },
  { name: 'Company', hidden: false, minWidth: 0, width: 0 },
  { name: 'Genre', hidden: false, minWidth: 0, width: 0 },
  { name: 'Image', hidden: false, minWidth: 0, width: 0 },
];
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Tab2Page implements OnInit {
  onChange($event: any) {
    console.log('$event::::::onChange', $event);
  }
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

  togglecheck = [{ ischecked: false }];

  constructor(
    private http: HttpClient,
    private _zone: NgZone,
    private elementRef: ElementRef,
    private platform: Platform
  ) {
    this.tempColumns = INITIALCOLUMNS;
    this.columns = [
      { name: 'Name', hidden: false, minWidth: 0, width: 0 },
      { name: 'Company', hidden: false, minWidth: 0, width: 0 },
      { name: 'Genre', hidden: false, minWidth: 0, width: 0 },
      { name: 'Image', hidden: false, minWidth: 0, width: 0 },
    ];
    this.ngxResizeWatcherDirective = NgxResizeWatcherDirective;
  }
  desktopPlatforme = this.platform.is('desktop');
  mobilePlatforme = this.platform.is('android');
  iosPlaform = this.platform.is('iphone');
  ipadPlatform = this.platform.is('ipad');

  ngOnInit(): void {
    if (this.getLocalStoragSort() !== null) {
      this.sortOrder = this.getDataRowSort();
    }
    if (this.getLocalStoragDrag !== null) {
      this.columns = this.getDataRowDrag();
    }
    if (this.gettoggleRowChanges() !== null) {
      this.togglecheck = this.getToggleRow();
    }

    if (this.getLocalStorageRow() !== null) {
      this.rows = JSON.parse(this.getLocalStorageRow());
    } else {
      this.http.get<Data>('../../assets/movies.json').subscribe((res) => {
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

  @HostListener('scroll') onScrollHost(e: Event): void {
    console.log('this.getYPosition(e)', this.getYPosition(e));
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  @HostListener('pointerdown', ['$event']) onPointerDown(e) {
    console.log('this.rowHeight::::::HostListener', this.rowHeight);
    e.stopPropagation();
    const columnName = e?.target?.parentNode?.querySelector(
      '.datatable-header-cell-label'
    )?.innerHTML;

    if (columnName !== undefined) {
      this.ignoreFitContent.add(columnName?.trim());
      const resizedCol = this.columns?.find((c) => {
        return c?.name.trim() === columnName?.trim();
      });
      resizedCol.minWidth = 0;
    }
    console.log('this.ischecked::::::', this.togglecheck[0].ischecked);
    if (this.togglecheck[0].ischecked) {
      this.element('5rem', 'auto');
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
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }
  getDataRowChanges(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStorageRow();
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
  // checked;
  element(width, height) {
    this.rows.map((val, index) => {
      const imagelement = document.getElementById(index);
      imagelement.style.width = width;
      imagelement.style.height = height;
    });
  }

  toggleRow(e, checked) {
    if (!e.detail.checked) {
      this.togglecheck[0].ischecked = false;
      checked = this.togglecheck[0].ischecked;
      this.rowHeight = undefined;
      this.element('auto', '100%');
      this.setLocalStoragetoggleRow(this.togglecheck);
    } else {
      this.togglecheck[0].ischecked = true;
      checked = this.togglecheck[0].ischecked;
      this.rowHeight = '5rem';
      this.element('5rem', 'auto');
      this.setLocalStoragetoggleRow(this.togglecheck);
    }
  }

  setLocalStoragetoggleRow(data) {
    return localStorage.setItem('resize-row', JSON.stringify(data));
  }
  gettoggleRowChanges() {
    return localStorage.getItem('resize-row');
  }
  getToggleRow(): any {
    let localJSON = this.tempColumns;
    const localData = this.gettoggleRowChanges();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  setLocalStorageSort(data) {
    return localStorage.setItem('sorting', JSON.stringify(data));
  }
  imageWidth: string;
  resize(e) {
    if (e?.column?.name) {
      this.ignoreFitContent.add(e.column.name);
      const resizedCol = this.columns.find((c) => {
        return c.name === e.column.name;
      });
      resizedCol.minWidth = 0;
      const allHeaders = document.querySelectorAll<HTMLElement>(
        '.datatable-header-cell'
      );
      allHeaders.forEach((header) => {
        if (header.innerText.trim() === e.column.name) {
          resizedCol.width = header?.clientWidth;
          console.log('resizedCol.width::::::resize', resizedCol.width);
          if (e.column.name === 'Image') {
            console.log('header?.clientWidth::::::', header?.clientWidth);
            this.imageWidth = header?.clientWidth as unknown as string;
            console.log('this.imageWidth::::::', this.imageWidth);
          }
        }
        // if (e.column.name == 'Image') {
        //   if (header.innerText.trim() === e.column.name) {
        //     resizedCol.width = header?.clientWidth;
        // this.element('100%', 'auto');
        //   }
        // }
      });
    }
    if (this.togglecheck[0].ischecked) {
      this.element('5rem', 'auto');
    }
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
    return localStorage.setItem('drag', JSON.stringify(data));
  }

  getLocalStoragDrag() {
    return localStorage.getItem('drag');
  }

  getDataRowDrag(): any {
    let localJSON = this.tempColumns;
    const localData = this.getLocalStoragDrag();
    if (localData && localData != null) {
      localJSON = JSON.parse(localData);
    }
    return localJSON;
  }

  onSort(event) {
    this.setLocalStorageSort(event.sorts);
  }
  rearrange(event) {
    const arr = this.array_move(this.columns, event.prevValue, event.newValue);
    this.setLocalStorageDrag(arr);
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
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
    if (this.togglecheck[0].ischecked) {
      this.element('5rem', 'auto');
    }
    const element = this.elementRef.nativeElement as HTMLElement;
    const rows = element.getElementsByTagName('datatable-body-row');
    let columnsWidth = {};
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('datatable-body-cell');
      for (let k = 0; k < cells.length; k++) {
        if (this.ignoreFitContent.has(this.columns[k].name)) {
          return;
        }
        const cell = cells[k];
        const cellSizer = cell.children[0].children[0].children[0].lastChild;
        try {
          var range = document.createRange();
          range?.selectNode(cellSizer);
          var rect = range.getBoundingClientRect().width;
          range.detach();
          console.log('rect::::::', rect);
          console.log('k::::::', k);
          console.log('columnsWidth::::::columnsWidth', columnsWidth);
          if (!(k in columnsWidth)) {
            columnsWidth = { ...columnsWidth, [k]: 0 };
          }
          const currentColunWidth = columnsWidth[k];
          if (rect < 100) {
            rect = 100;
          }
          const newColumnWidth = Math.max(currentColunWidth, rect);
          console.log('newColumnWidth::::::newColumnWidth', newColumnWidth);
          columnsWidth[k] = newColumnWidth;
          this.columns[k].minWidth = newColumnWidth;
          this.columns[k].width = newColumnWidth;
        } catch (e) {
          console.log('e::getting width error::::', e);
        }
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    // console.log('event::::::drop', event);
    const arr = this.array_move(
      this.columns,
      event.previousIndex,
      event.currentIndex
    );
    this.setLocalStorageDrag(arr);
    // console.log('window.scrollY ::::::', window.scrollY);
  }
  test(e) {
    // console.log('e::::::test', e);
  }
  currentlyLoadedPage = 0;
}

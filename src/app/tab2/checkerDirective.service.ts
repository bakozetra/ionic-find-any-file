import {
  Directive,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Directive({ selector: '[ngx-resize-watcher]' })
export class NgxResizeWatcherDirective implements AfterContentChecked {
  constructor(
    private table: DatatableComponent,
    public ref: ChangeDetectorRef
  ) {}

  private latestWidth: number;

  public ngAfterContentChecked() {
    if (this.table && this.table.element.clientWidth !== this.latestWidth) {
      this.latestWidth = this.table.element.clientWidth;
      console.log('this.latestWidth::::::', this.latestWidth);
      this.table.recalculate();
      this.ref.markForCheck();
    }
  }
}

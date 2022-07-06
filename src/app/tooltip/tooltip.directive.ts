import { Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
@Directive({
  selector: '[tooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input() tooltip = ''; // The text for the tooltip to display
  @Input() delay? = 400; // Optional delay input, in ms
  @Input() wordsNumber = '';
  private myPopup;
  private timer;
  private longPressTimer;
  private longPressDelay = 1500;

  constructor(public platform: Platform) {}
  ngOnDestroy(): void {
    if (this.myPopup) {
      this.myPopup.remove();
    }
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(e) {
    const isDesktop = this.platform.is('desktop');
    if (!isDesktop) {
      return;
    }
    this.timer = setTimeout(() => {
      let x = e.clientX + 10; //x position within the element.
      let y = e.clientY + 10;
      this.createTooltipPopup(x, y);
    }, this.delay);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.timer) clearTimeout(this.timer);
    if (this.myPopup) {
      this.myPopup.remove();
    }
  }

  @HostListener('mousedown') onMouseDown() {
    const isdesktop = this.platform.is('desktop');
    if (!isdesktop) {
      return;
    }
    if (this.timer) clearTimeout(this.timer);
    if (this.myPopup) {
      this.myPopup.remove();
    }
  }

  @HostListener('pointerdown', ['$event']) onPointerDown(e) {
    const isDesktop = this.platform.is('desktop');
    if (isDesktop) {
      return;
    }
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    this.longPressTimer = setTimeout(() => {
      let x = e.clientX + 10;
      let y = e.clientY + 10;
      this.createTooltipPopup(x, y);
    }, this.longPressDelay);
  }

  @HostListener('mouseup') onMouseUp() {
    const isDesktop = this.platform.is('desktop');
    if (isDesktop) {
      return;
    }
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
  }

  @HostListener('pointerup') onPointerUp() {
    const isDesktop = this.platform.is('desktop');
    if (isDesktop) {
      return;
    }
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
  }

  @HostListener('document: mousemove', ['$event']) onMouseMove(e) {
    const isDesktop = this.platform.is('desktop');
    if (!isDesktop) {
      return;
    }
    const x = e.clientX + 10;
    const y = e.clientY + 10;
    if (this.myPopup) {
      this.myPopup.style.left = `${x}px`;
      this.myPopup.style.top = `${y}px`;
    }
  }

  @HostListener('pointerleave', ['$event'])
  onPointerleave(event) {
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
  }

  @HostListener('pointerover', ['$event'])
  onPointerOver(event) {
    // fixing iphone issue
    document.querySelectorAll('#tooltip-id').forEach((el) => el.remove());
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    if (this.timer) clearTimeout(this.timer);
    if (this.myPopup) {
      this.myPopup.remove();
    }
    event.preventDefault();
  }

  private createTooltipPopup(x: number, y: number) {
    if (this.myPopup) this.myPopup.remove();
    let popup = document.createElement('div');
    document.querySelectorAll('#tooltip-id').forEach((el) => el.remove());
    popup.innerHTML = this.tooltip + this.wordsNumber;
    popup.setAttribute('class', 'tooltipContainer');
    popup.setAttribute('id', 'tooltip-id');
    popup.style.top = y.toString() + 'px';
    popup.style.left = x.toString() + 'px';
    popup.style.position = 'absolute';
    document.body.appendChild(popup);
    this.myPopup = popup;
  }
}

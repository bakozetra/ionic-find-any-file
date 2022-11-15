import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-standar-button',
  templateUrl: './standar-button.component.html',
  styleUrls: ['./standar-button.component.css'],
})
export class StandarButtonComponent implements OnInit {
  @Input() buttonText: string;
  @Output() newItemEvent = new EventEmitter();
  buttonActive: boolean = true;
  @Input() disableButton: any = false;

  constructor() {}

  ngOnInit(): void {}
  clickButton() {
    this.newItemEvent.emit(!this.disableButton);
  }
}

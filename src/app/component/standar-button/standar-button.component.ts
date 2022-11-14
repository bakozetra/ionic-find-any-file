import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-standar-button',
  templateUrl: './standar-button.component.html',
  styleUrls: ['./standar-button.component.css'],
})
export class StandarButtonComponent implements OnInit {
  @Input() buttonText: string;
  @Output() newItemEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  clickButton(value) {
    this.newItemEvent.emit(value);
  }
}

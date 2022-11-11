import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-radio-buttons',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['./radio-buttons.component.css'],
})
export class RadioButtonsComponent implements OnInit {
  @Input() friensTooltipText: string;
  @Input() familyTooltipText: string;
  @Input() enemiesTooltipText: string;
  constructor() {}

  ngOnInit(): void {}
}

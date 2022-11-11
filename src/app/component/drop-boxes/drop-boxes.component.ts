import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-boxes',
  templateUrl: './drop-boxes.component.html',
  styleUrls: ['./drop-boxes.component.css'],
})
export class DropBoxesComponent implements OnInit {
  @Input() dropboxesTooltipTextTop: string;
  @Input() dropboxesTooltipTextPet: string;
  constructor() {}

  ngOnInit(): void {}
}

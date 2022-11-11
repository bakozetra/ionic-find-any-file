import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropBoxesComponent } from './drop-boxes.component';

describe('DropBoxesComponent', () => {
  let component: DropBoxesComponent;
  let fixture: ComponentFixture<DropBoxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropBoxesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HclwComponent } from './hclw.component';

describe('HclwComponent', () => {
  let component: HclwComponent;
  let fixture: ComponentFixture<HclwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HclwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HclwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

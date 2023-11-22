import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcCollectingBankComponent } from './ec-collecting-bank.component';

describe('EcCollectingBankComponent', () => {
  let component: EcCollectingBankComponent;
  let fixture: ComponentFixture<EcCollectingBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcCollectingBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcCollectingBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

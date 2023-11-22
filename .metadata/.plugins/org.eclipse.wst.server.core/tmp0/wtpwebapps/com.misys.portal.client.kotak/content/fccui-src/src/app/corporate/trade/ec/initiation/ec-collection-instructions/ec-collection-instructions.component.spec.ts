import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcCollectionInstructionsComponent } from './ec-collection-instructions.component';

describe('EcCollectionInstructionsComponent', () => {
  let component: EcCollectionInstructionsComponent;
  let fixture: ComponentFixture<EcCollectionInstructionsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ EcCollectionInstructionsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcCollectionInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

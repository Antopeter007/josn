import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfAttachmentDetailsComponent } from './tf-attachment-details.component';

describe('TfAttachmentDetailsComponent', () => {
  let component: TfAttachmentDetailsComponent;
  let fixture: ComponentFixture<TfAttachmentDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TfAttachmentDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfAttachmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

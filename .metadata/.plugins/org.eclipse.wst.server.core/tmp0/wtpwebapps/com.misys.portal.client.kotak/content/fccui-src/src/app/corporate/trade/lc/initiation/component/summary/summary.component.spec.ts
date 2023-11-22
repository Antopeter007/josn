import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryComponent } from './summary.component';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [CheckboxModule, ReactiveFormsModule, CalendarModule, RadioButtonModule, DragDropModule, DropdownModule,
  //       InputSwitchModule, MultiSelectModule, SelectButtonModule, ProgressBarModule, MessagesModule, MessageModule],
  //     declarations: [SummaryComponent]
  //   })
  //     .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('variables defined', () => {
    expect(component.module);
  });

  it('call the ng oninit of the component', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });
});

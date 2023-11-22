import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RetrieveCredentialsMasterComponent } from './retrieve-credentials-master.component';


describe('RetrieveCredentialsMasterComponent', () => {
  let component: RetrieveCredentialsMasterComponent;
  let fixture: ComponentFixture<RetrieveCredentialsMasterComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ RetrieveCredentialsMasterComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveCredentialsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

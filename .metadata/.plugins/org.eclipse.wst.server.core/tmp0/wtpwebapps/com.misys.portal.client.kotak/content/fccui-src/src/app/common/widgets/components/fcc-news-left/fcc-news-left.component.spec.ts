// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { RouterTestingModule } from '@angular/router/testing';
// import { HttpClient, HttpHandler } from '@angular/common/http';
// import { CarouselModule } from 'primeng/carousel';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { CardModule } from 'primeng/card';
// import { TooltipModule } from 'primeng/tooltip';
// import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';
// import { DialogService } from 'primeng/api';

// describe('FccNewsComponent', () => {
//   let component: FccNewsComponent;
//   let fixture: ComponentFixture<FccNewsComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [CarouselModule, BrowserAnimationsModule, RouterTestingModule.withRoutes([]),
//       TranslateModule.forRoot(), HttpClientTestingModule, CardModule, TooltipModule, RouterModule],
//       declarations: [FccNewsComponent],
//       providers: [DialogService, TranslateService, HttpClient, HttpHandler]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(FccNewsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create a news component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('default title is : fccNewsComponent', () => {
//     expect(component.title).toEqual('fccNewsComponent');
//   });

//   it('syndicated News is : []', () => {
//     expect(component.syndicatedNews).toEqual([]);
//   });

//   it('call the ngonit of the component ', () => {
//     spyOn(component, 'updateValues').and.callThrough();
//     component.ngOnInit();
//     expect(component.updateValues).toHaveBeenCalled();
//   });



// });

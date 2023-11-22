import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterestDetailsPopupComponent } from './interest-details-popup.component';

describe('InterestDetailsPopupComponent', () => {
    let component: InterestDetailsPopupComponent;
    let fixture: ComponentFixture<InterestDetailsPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InterestDetailsPopupComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InterestDetailsPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWComponent } from './image-w.component';

describe('ImageWComponent', () => {
  let component: ImageWComponent;
  let fixture: ComponentFixture<ImageWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageWComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

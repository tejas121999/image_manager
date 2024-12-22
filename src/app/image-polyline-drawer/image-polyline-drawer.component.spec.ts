import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePolylineDrawerComponent } from './image-polyline-drawer.component';

describe('ImagePolylineDrawerComponent', () => {
  let component: ImagePolylineDrawerComponent;
  let fixture: ComponentFixture<ImagePolylineDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagePolylineDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagePolylineDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

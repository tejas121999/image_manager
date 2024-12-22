import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as fabric from 'fabric';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'image-manager';

  @ViewChild('imageCanvas') imageCanvas!: ElementRef<HTMLCanvasElement>;
  public imageUrl: any;
  uploadedImg: any;
  public imageWidth: number = 0;
  public imageHeight: number = 0;
  private ctx: CanvasRenderingContext2D | null = null; // Important: Make ctx nullable
  private points: { x: number; y: number }[] = [];
  private isDrawing = false;
  private image: HTMLImageElement | null = null; // Store the image element
  private mouseDownListener: any;
  private mouseMoveListener: any;
  private mouseUpListener: any;
  private mouseOutListener: any;
  constructor(private http: HttpClient) {}
  baseURL: any = 'http://localhost:8080/api/image';

  ngAfterViewInit(): void {
    if (this.imageCanvas && this.ctx) {
      this.mouseDownListener = this.startDrawing.bind(this);
      this.mouseMoveListener = this.draw.bind(this);
      this.mouseUpListener = this.stopDrawing.bind(this);
      this.mouseOutListener = this.stopDrawing.bind(this);

      this.imageCanvas.nativeElement.addEventListener(
        'mousedown',
        this.mouseDownListener
      );
      this.imageCanvas.nativeElement.addEventListener(
        'mousemove',
        this.mouseMoveListener
      );
      this.imageCanvas.nativeElement.addEventListener(
        'mouseup',
        this.mouseUpListener
      );
      this.imageCanvas.nativeElement.addEventListener(
        'mouseout',
        this.mouseOutListener
      );
    }
  }

  ngOnDestroy(): void {
    if (this.imageCanvas && this.ctx) {
      this.imageCanvas.nativeElement.removeEventListener(
        'mousedown',
        this.mouseDownListener
      );
      this.imageCanvas.nativeElement.removeEventListener(
        'mousemove',
        this.mouseMoveListener
      );
      this.imageCanvas.nativeElement.removeEventListener(
        'mouseup',
        this.mouseUpListener
      );
      this.imageCanvas.nativeElement.removeEventListener(
        'mouseout',
        this.mouseOutListener
      );
    }
  }

  ngOnInit(): void {}
  imageUpload(event: any) {
    this.uploadedImg = event.target.files[0];
    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.uploadedImg);

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.image = new Image(); // Create image instance here
        this.image.onload = () => {
          this.imageWidth = this.image!.width; // Use non-null assertion
          this.imageHeight = this.image!.height;
          if (this.ctx) {
            // Check ctx before drawing
            this.ctx.drawImage(
              this.image!,
              0,
              0,
              this.imageWidth,
              this.imageHeight
            );
          }
        };
        this.image.src = this.imageUrl;
      };
      reader.readAsDataURL(file);
    }
  }

  saveImage() {
    var payload = {};
    this.http.post(this.baseURL + '/upload', payload);
  }

  startDrawing(event: MouseEvent) {
    if (!this.image || !this.ctx) return;
    this.isDrawing = true;
    this.points.push({ x: event.offsetX, y: event.offsetY });
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing || !this.ctx || !this.image) return; // Check ctx and image
    this.ctx.clearRect(0, 0, this.imageWidth, this.imageHeight);
    this.ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight); // Draw image first
    this.ctx.beginPath();
    if (this.points.length > 0) {
      this.ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        this.ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      this.ctx.lineTo(event.offsetX, event.offsetY); // Draw line to current mouse position
    }
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
    if (this.ctx && this.image && this.points.length > 1) {
      this.ctx.clearRect(0, 0, this.imageWidth, this.imageHeight);
      this.ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight);
      this.ctx.beginPath();
      this.ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        this.ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
    this.points = [];
  }
  savePolyline() {
    if (!this.image || !this.ctx) return;
    const canvas = document.createElement('canvas');
    canvas.width = this.imageWidth;
    canvas.height = this.imageHeight;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, this.imageWidth, this.imageHeight);
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'polyline_image.png';
      link.click();
    };
    img.src = this.imageUrl;
  }
}

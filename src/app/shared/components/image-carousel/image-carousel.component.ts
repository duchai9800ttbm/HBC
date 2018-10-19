import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from '../../services';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  @Input() imageUrlArray;
  @Input() indexOfImage;
  @Output() closed = new EventEmitter<boolean>();
  slideIndex = 1;
  i = (this.indexOfImage) ? this.indexOfImage : 0;
  isShow;
  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) { this.closed.emit(true); }
    });
    document.addEventListener('keyup', e => {
      if (e.keyCode === 37) { this.prevButton(); }
    });
    document.addEventListener('keyup', e => {
      if (e.keyCode === 39) { this.nextButton(); }
    });
    this.showOneImage(this.i);
  }
  prevButton() {
    if (this.i > 0) {
      this.i -= 1;
      this.showOneImage(this.i);
    } else {
      this.i = this.imageUrlArray.length - 1;
    }
  }
  nextButton() {
    if (this.i < this.imageUrlArray.length - 1) {
      this.i += 1;
      this.showOneImage(this.i);
    } else {
      this.i = 0;
    }
  }
  showOneImage(i) {
    this.isShow = i;
  }
  closeView() {
    this.closed.emit(true);
  }
  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.returnValue = false;
  }
}

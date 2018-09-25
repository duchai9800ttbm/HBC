import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit, OnDestroy {
  @Input() showImage: boolean;
  slideIndex = 1;
  constructor() { }

  ngOnInit() {
    this.disableScroll();
  }
  ngOnDestroy() {
    this.enableScroll();
  }

  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.returnValue = false;
  }
  disableScroll() {
    window.addEventListener('DOMMouseScroll', this.preventDefault, false);
    window.onwheel = this.preventDefault;
  }
  enableScroll() {
    window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
  }
}

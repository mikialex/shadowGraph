export class Canvas2DRenderer{
  constructor(el:HTMLCanvasElement) {
    this.el = el;
    this.context = el.getContext('2d');
    // this.width = el.clientWidth
  }
  el: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: 100;
  height: 100;

  draw(drawMethod: (CanvasRenderingContext2D)=> void) {
    drawMethod(this.context);
  }

  drawNodeQueue = [];

  pushDrawNode() {

  }

}
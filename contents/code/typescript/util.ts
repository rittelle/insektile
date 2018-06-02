class Rectangle {
  public x: number
  public y: number
  public w: number
  public h: number

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
}

function qRectToRectangle(rect: QRect) {
  return {
    x: rect.x,
    y: rect.y,
    w: rect.width,
    h: rect.height,
  }
}

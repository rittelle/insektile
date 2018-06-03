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

  /** Shrinks the recangle by a on every side and returns the result */
  public trim(a: number): Rectangle {
    return new Rectangle(
      this.x + a,
      this.y + a,
      this.w - 2 * a,
      this.h - 2 * a,
    )
  }
}

function qRectToRectangle(rect: QRect) {
  return new Rectangle(
    rect.x,
    rect.y,
    rect.width,
    rect.height,
  )
}

function rectangleToQRect(rectangle: Rectangle) {
  return Qt.qrect(rectangle.x, rectangle.y, rectangle.w, rectangle.h)
}

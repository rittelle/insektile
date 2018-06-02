Qt.include("./model.js")

class Overlay {
  private frames: QmlItem[]
  private parent: QtObject

  constructor(parent: QtObject) {
    this.frames = []
    this.parent = parent
  }

  get shown(): boolean {
    return this.frames.length !== 0
  }

  public isShown(): boolean {
    return this.shown
  }

  public showFor(item: IItem) {
    this.hide()
    const component = Qt.createComponent("../../ui/OverlayFrame.qml")
    if (component.status === Component.Ready) {
      print("Success")
      this.showComponentFor(item, component)
    } else {
      print("An error occured while creating the overlay: " + component.errorString())
    }
  }

  public hide() {
    for (const frame of this.frames) {
      frame.destroy()
    }
    this.frames = []
  }

  private showComponentFor(item: IItem, component: Component) {
    function hasContent(i: IItem): i is Container {
      return (i as Container).content !== undefined
    }

    const frame = component.createObject(this.parent, {
      frameX: item.rectangle.x,
      frameY: item.rectangle.y,
      frameW: item.rectangle.w,
      frameH: item.rectangle.h,
    })
    this.frames.push(frame)
    //if (item instanceof Container) {
    if (hasContent(item)) {
      for (const child of item.content) {
        this.showComponentFor(child, component)
      }
    } else {
    }
  }
}

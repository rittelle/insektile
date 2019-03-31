Qt.include("./model.js")

class Overlay {
  private frames: QmlItem[]
  private windows: QmlItem[]
  private tilingManager: TilingManager
  private parent: QtObject

  constructor(tilingManager: TilingManager, parent: QtObject) {
    this.frames = []
    this.windows = []
    this.tilingManager = tilingManager
    this.parent = parent
  }

  get shown(): boolean {
    return this.windows.length !== 0
  }

  public showForDesktop(desktop: Desktop) {
    const component = Qt.createComponent("../../ui/OverlayWindow.qml")
    if (component.status === Component.Ready) {
      for (const screen of desktop.screens) {
        const window = component.createObject(this.parent, {})
        const windowAny = window as any
        //print(Object.keys(windowAny))
        windowAny.screenX = screen.rectangle.x
        windowAny.screenY = screen.rectangle.y
        windowAny.screenH = screen.rectangle.h
        windowAny.screenW = screen.rectangle.w
        this.windows.push(window)
        const mainItem = windowAny.mainItem
        this.showForItem(screen.tiled, mainItem)
      }
    } else {
      print("An error occurred while creating the overlay: " + component.errorString())
    }
  }

  public showForItem(item: IItem, window: QtObject) {
    const component = Qt.createComponent("../../ui/OverlayFrame.qml")
    if (component.status === Component.Ready) {
      print("Successfully loaded the overlay component")
      this.showComponentForItem(item, window, component)
    } else {
      print("An error occurred while creating the overlay: " + component.errorString())
    }
  }

  public hide() {
    for (const frame of this.frames) {
      frame.destroy()
    }
    this.frames = []
    for (const window of this.windows) {
      window.destroy()
    }
    this.windows = []
  }

  private showComponentForItem(item: IItem, window: QtObject, component: Component) {
    let title = "ERROR"
    let isActive = false

    if (isContainer(item)) {
      title = "TODO"
    } else if (isClient(item)) {
      title = item.caption
      isActive = item.windowId === this.tilingManager.currentClient.windowId
    }

    const frame = component.createObject(window, {
      frameX: item.rectangle.x,
      frameY: item.rectangle.y,
      frameW: item.rectangle.w,
      frameH: item.rectangle.h,
      isContainer: isContainer(item),
      isActive: isActive,
      title: title,
    })
    this.frames.push(frame)
    //if (item instanceof Container) {
    if (isContainer(item)) {
      for (const child of item.children) {
        this.showComponentForItem(child, window, component)
      }
    } else {
    }
  }
}

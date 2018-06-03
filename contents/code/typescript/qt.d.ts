declare namespace Qt {
  function include(path: string): void

  // Returns null on empty strings!
  function createComponent(url: string, mode?: object /* TODO: Enum */, parent?: object): Component

  /** Creates a QRect object. */
  function qrect(x: number, y: number, width: number, height: number): QRect
}

declare class QtObject {
}

declare class QtSignal {
  public connect(slot: any): void
}

declare class QRect {
  x: number
  y: number
  width: number
  height: number
}

declare class Component {
  //static ComponentStatus = ComponentStatus

  status: Component.Status

  // TODO: Return value correct?
  public createObject(parent?: QtObject, properties?: object): QmlItem

  public errorString(): string
}

declare namespace Component {
  enum Status { }

  let Null: Status
  let Ready: Status
  let Loading: Status
  let Error: Status
}

declare class QmlItem {
  destroy(delay?: number): void
}

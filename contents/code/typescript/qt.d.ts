declare namespace Qt {
  function include(path: string)

  // Returns null on empty strings!
  function createComponent(url: string, mode?: object /* TODO: Enum */, parent?: object): Component
}

declare class QtObject {
}

declare class QtSignal {
  public connect(slot: any)
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
  createObject(parent?: QtObject, properties?: object): QmlItem

  errorString(): string
}

declare namespace Component {
  enum Status {}

  let Null: Status
  let Ready: Status
  let Loading: Status
  let Error: Status
}

declare class QmlItem {
  destroy(delay?: number)
}

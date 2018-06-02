class Workspace {
  public activities: Activity[]
  public currentActivityIndex: number
  public currentDesktopIndex: number

  constructor() {
    this.activities = []
  }

  get currentActivity(): Activity {
    return this.activities[this.currentActivityIndex]
  }

  get currentDesktop(): Desktop {
    return this.currentActivity.desktops[this.currentDesktopIndex]
  }

  public encode(): IWorkspaceJSON {
    return {
      activities: this.activities.map((a) => a.encode()),
      currentActivityIndex: this.currentActivityIndex,
      currentDesktopIndex: this.currentDesktopIndex,
    }
  }
}

class Activity {
  public id: string
  public desktops: Desktop[]

  constructor(id: string) {
    this.id = id
    this.desktops = []
  }

  public encode(): IActivityJSON {
    return {
      id: this.id,
      desktops: this.desktops.map((a) => a.encode()),
    }
  }
}

class Desktop {
  public name: string
  public floating: Client[]
  public tiled: Container

  constructor(name: string, tiled) {
    this.name = name
    this.floating = []
    this.tiled = tiled
  }

  public encode(): IDesktopJSON {
    return {
      floating: this.floating.map((a) => a.encode()),
      name: this.name,
      tiled: this.tiled.encode(),
    }
  }
}

interface IItem {
  rectangle: Rectangle

  encode(): IItemJSON
}

abstract class Container implements IItem {
  public abstract rectangle: Rectangle
  public abstract content: IItem[]

  public abstract add(client: Client)
  public abstract encode(): IItemJSON
}

abstract class ArrayContainer extends Container {
  public content: IItem[] = []
  public rectangle: Rectangle

  public add(client: Client) {
    this.content.push(client)
  }

  public encode(): IArrayContainerJSON {
    return {
      content: this.content.map((a) => a.encode()),
      rectangle: this.rectangle,
    }
  }
}

class HorizontalArrayContainer extends ArrayContainer {
}

class Client implements IItem {
  public client: KWinClient

  get caption(): string { return this.client.caption }
  get rectangle(): Rectangle { return qRectToRectangle(this.client.geometry) }

  constructor(client: KWinClient) { this.client = client }

  public encode(): IClientJSON {
    return {
      caption: this.caption,
      rectangle: this.rectangle,
    }
  }
}

// --------------------------------------------------------

interface IJSONEncoded { }

interface IWorkspaceJSON extends IJSONEncoded {
  activities: IActivityJSON[]
  currentActivityIndex: number
  currentDesktopIndex: number
}

interface IActivityJSON extends IJSONEncoded {
  id: string
  desktops: IDesktopJSON[]
}

interface IDesktopJSON extends IJSONEncoded {
  name: string
  floating: IClientJSON[]
  tiled: IJSONEncoded
}

interface IItemJSON {
  rectangle: Rectangle
}

interface IArrayContainerJSON extends IItemJSON {
  content: IItemJSON[]
}

interface IClientJSON extends IItemJSON {
  caption: string
}

class Workspace {
  public activities: Activity[]
  public currentActivityIndex: number
  public currentDesktopIndex: number
  public currentScreenIndex: number
  public currentClientId: number

  constructor() {
    this.activities = []
  }

  get currentActivity(): Activity {
    return this.activities[this.currentActivityIndex]
  }

  get currentDesktop(): Desktop {
    return this.currentActivity.desktops[this.currentDesktopIndex]
  }

  get currentScreen(): Screen {
    return this.currentDesktop.screens[this.currentScreenIndex]
  }

  get currentClient(): Client | null {
    if (this.currentClientId < 0) {
      return null
    }
    const result = this.clientWithWindowId(this.currentClientId)
    if (result === null) {
      print("Unable to find the currently active client")
    }
    return result
  }

  get allDesktops(): Desktop[] {
    const ret: Desktop[] = []
    for (const activity of this.activities) {
      for (const desktop of activity.desktops) {
        ret.push(desktop)
      }
    }
    return ret
  }

  get allScreens(): Screen[] {
    const ret: Screen[] = []
    for (const desktop of this.allDesktops) {
      for (const screen of desktop.screens) {
        ret.push(screen)
      }
    }
    return ret
  }

  public activityWithId(activityId: string): Activity | null {
    for (const activity of this.activities) {
      if (activity.id === activityId) {
        return activity
      }
    }
    return null
  }

  public clientWithWindowId(windowId: number): Client | null {
    for (const client of this.currentScreen.tiled.clients) {
      if (client.windowId === windowId) {
        return client
      }
    }
    for (const client of this.currentScreen.floating) {
      if (client.windowId === windowId) {
        return client
      }
    }
    return null
  }

  public desktopNumber(desktop: Desktop): number {
    for (const activity of this.activities) {
      const desktops = activity.desktops
      for (const idx in desktops) {
        if (desktops.hasOwnProperty(idx)) {
          if (desktops[idx] === desktop) {
            return Number(idx) + 1 // This KWin counts from 1 thingy
          }
        }
      }
    }
    print("Could not find number for screen")
    return -1
  }

  public screenNumber(screen: Screen): number {
    for (const desktop of this.allDesktops) {
      const screens = desktop.screens
      for (const idx in screens) {
        if (screens.hasOwnProperty(idx)) {
          if (screens[idx] === screen) {
            return Number(idx)
          }
        }
      }
    }
    print("Could not find number for screen")
    return -1
  }

  public desktopOfScreen(screen: Screen): Desktop {
    for (const d of this.allDesktops) {
      for (const s of d.screens) {
        if (screen === s) {
          return d
        }
      }
    }
    print("Could not find desktop for screen")
    return null
  }

  /**
   * Returns a list of the parent items of item.
   * 
   * An item can have multiple parents if it is visible on multiple activities or desktops.
   * 
   * @param item
   */
  public parentItems(item: IItem): IItem[] {
    function findParent(currentItem: IItem): IItem[] {
      if (isClient(currentItem)) {
        return []
      } else if (isContainer(currentItem)) {
        let ret: IItem[] = []
        for (const child of currentItem.children) {
          if (child === item) {
            return [currentItem]
          }
          const parents = findParent(child)
          if (parents.length > 0) {
            ret = ret.concat(parents)
          }
        }
        return ret
      } else {
        print("Okay... " + item + "?")
      }
      return []
    }

    let ret: IItem[] = []
    for (const screen of this.allScreens) {
      const parents = findParent(screen.tiled)
      if (parents.length > 0) {
        ret = ret.concat(parents)
      }
    }
    return ret
  }

  public screenOf(item: IItem): Screen {
    function isItemChildOf(parentItem: IItem): boolean {
      if (isClient(parentItem)) {
        return null
      } else if (isContainer(parentItem)) {
        for (const child of parentItem.children) {
          if (child === item) {
            return true
          }
          if (isItemChildOf(child)) {
            return true
          }
        }
      } else {
        print("Okay... " + item + "?")
      }
      return null
    }

    for (const screen of this.allScreens) {
      if (isItemChildOf(screen.tiled)) {
        return screen
      }
      if (isClient(item)) {
        for (const floated of screen.floating) {
          if (floated.windowId === item.windowId) {
            return screen
          }
        }
      }
    }
    print("Item does not have a screen?!")
    return null
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
  public screens: Screen[]

  constructor(name: string) {
    this.name = name
    this.screens = []
  }

  public encode(): IDesktopJSON {
    return {
      name: this.name,
      screens: this.screens.map((a) => a.encode()),
    }
  }
}

class Screen {
  public rectangle: Rectangle
  public floating: Client[]
  public tiled: Container

  constructor(tiled: Container) {
    this.floating = []
    this.tiled = tiled
  }

  public encode(): IScreenJSON {
    return {
      rectangle: this.rectangle,
      floating: this.floating.map((a) => a.encode()),
      tiled: this.tiled.encode(),
    }
  }
}

interface IItem {
  rectangle: Rectangle
  clients: Client[]

  encode(): IItemJSON
}

abstract class Container implements IItem {
  public abstract rectangle: Rectangle
  public abstract children: IItem[]

  get clients(): Client[] {
    let ret: Client[] = []
    for (const child of this.children) {
      ret = ret.concat(child.clients)
    }
    return ret
  }

  public abstract add(client: Client): void
  public abstract remove(client: Client): boolean
  public abstract encode(): IItemJSON
}

abstract class ArrayContainer extends Container {
  public rectangle: Rectangle
  public content: ArrayContainerEntry[] = []

  get children(): IItem[] {
    return this.content.map((entry) => entry.child)
  }

  get includedRatioSum(): number {
    let total = 0
    for (const entry of this.content) {
      const child = entry.child
      if (isClient(child)) {
        if (!child.minimized && !child.maximizedH && !child.maximizedV) {
          total += entry.ratio
        }
      } else {
        total += entry.ratio
      }
    }
    return total
  }

  public add(client: Client) {
    const oldLength = this.content.length
    this.rebaseRatios(this.content, oldLength / (oldLength + 1))
    this.content.push({ child: client, ratio: 1.0 / (oldLength + 1) })
  }

  public remove(client: Client): boolean {
    const index = this.children.indexOf(client)
    if (index < 0) {
      return false
    }
    this.content.splice(index, 1)
    this.rebaseRatios(this.content, 1.0)
    return true
  }

  public encode(): IArrayContainerJSON {
    return {
      content: this.content.map((a) => ({ child: a.child.encode(), ratio: a.ratio })),
      rectangle: this.rectangle,
    }
  }

  public rebaseRatios(entries: ArrayContainerEntry[], sum: number) {
    let total = 0.0
    for (const entry of this.content) {
      total += entry.ratio
    }
    for (const entry of this.content) {
      entry.ratio *= sum / total
    }
  }
}

class ArrayContainerEntry {
  public child: IItem
  public ratio: number
}

class HorizontalArrayContainer extends ArrayContainer {
}

class Client implements IItem {
  public client: KWinClient
  public rectangle: Rectangle
  public maximizedV: boolean
  public maximizedH: boolean

  get clients(): Client[] { return [this] }
  get caption(): string { return this.client.caption }
  get windowId(): number { return this.client.windowId }
  get minimized(): boolean { return this.client.minimized }

  constructor(client: KWinClient) { this.client = client }

  public getRectangle(): void {
    this.rectangle = qRectToRectangle(this.client.geometry)
  }

  public setRectangle(): void {
    //this.client.geometry = rectangleToQRect(this.rectangle)
    this.client.geometry.x = this.rectangle.x
    this.client.geometry.y = this.rectangle.y
    this.client.geometry.width = this.rectangle.w
    this.client.geometry.height = this.rectangle.h
  }

  public encode(): IClientJSON {
    return {
      caption: this.caption,
      rectangle: this.rectangle,
      windowId: this.windowId,
      maximizedH: this.maximizedH,
      maximizedV: this.maximizedV,
      minimized: this.minimized
    }
  }
}

function isContainer(item: IItem): item is Container {
  return (item as Container).children !== undefined
}

function isClient(item: IItem): item is Client {
  return (item as Client).caption !== undefined
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
  screens: IScreenJSON[]
}

interface IScreenJSON extends IJSONEncoded {
  rectangle: Rectangle
  floating: IClientJSON[]
  tiled: IJSONEncoded
}

interface IItemJSON {
  rectangle: Rectangle
}

interface IArrayContainerJSON extends IItemJSON {
  content: IArrayContainerEntryJSON[]
}

interface IArrayContainerEntryJSON extends IJSONEncoded {
  child: IItemJSON
  ratio: number
}

interface IClientJSON extends IItemJSON {
  caption: string
  rectangle: Rectangle
  windowId: number
  maximizedH: boolean
  maximizedV: boolean
  minimized: boolean
}

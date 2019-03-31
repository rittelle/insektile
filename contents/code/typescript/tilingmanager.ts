Qt.include("./logger.js")
Qt.include("./model.js")
Qt.include("./util.js")

class TilingManager {
  private l: Logger = new Logger("TilingManager")
  private tree: Workspace
  // TODO: Turn these into settings
  private ignoredWindowClasses: string[] = ["plasmashell"]
  private autoTiling: boolean = false
  private spacing: number = 10

  get currentActivity(): Activity {
    return this.tree.currentActivity
  }

  get currentDesktop(): Desktop {
    return this.tree.currentDesktop
  }

  get currentClient(): Client {
    return this.tree.currentClient
  }

  get encodedTree(): IWorkspaceJSON {
    return this.tree.encode()
  }

  public initializeModel() {
    const activityIndex = 0
    const clientList = workspace.clientList()
    this.tree = new Workspace()
    let currentActivityIndex = -1
    let currentScreenIndex = -1
    let currentDesktopIndex = -1

    for (const a in workspace.activities) {
      if (!workspace.activities[a] === undefined) {
        this.l.e("Invalid activity key: '" + a + "'!?")
        break
      } else {
        const activity = new Activity(workspace.activities[a])
        this.tree.activities.push(activity)

        for (let d = 1; d <= workspace.desktops; ++d) {
          const desktop = new Desktop(workspace.desktopName(d))
          if (d === workspace.currentDesktop) {
            currentDesktopIndex = d - 1
          }

          for (let s = 0; s < workspace.numScreens; ++s) {
            const screen = new Screen(new HorizontalArrayContainer())
            screen.rectangle = qRectToRectangle(workspace.clientArea(0, s, d))
            screen.tiled.rectangle = screen.rectangle
            if (s === workspace.activeScreen) {
              currentScreenIndex = s
            }

            for (const c of clientList) {
              // No .includes() available
              // If a window is shown on all activities, the activity list is empty...
              let inCurrentActivity = c.activities.length === 0

              for (const aId of c.activities) {
                if (aId === activity.id) {
                  inCurrentActivity = true
                  break
                }
              }

              if (inCurrentActivity && c.desktop === d && c.managed) {
                const client = new Client(c)
                client.getRectangle()
                screen.tiled.add(client)
              }
            }

            desktop.screens.push(screen)
          }

          activity.desktops.push(desktop)
        }

        if (activity.id === workspace.currentActivity) {
          currentActivityIndex = activityIndex
        }
      }

      this.tree.currentActivityIndex = currentActivityIndex
      this.tree.currentScreenIndex = currentScreenIndex
      this.onCurrentDesktopChanged()
      this.onClientActivated()
    }
  }

  public doLayoutForDesktop(desktop: Desktop) {
    for (const screen of this.currentDesktop.screens) {
      this.doLayoutForScreen(screen)
    }
  }

  public doLayoutForScreen(screen: Screen) {
    const desktop = this.tree.desktopOfScreen(screen)
    const clientArea = screen.rectangle = qRectToRectangle(workspace.clientArea(0, this.tree.screenNumber(screen), this.tree.desktopNumber(desktop)))
    screen.rectangle = clientArea
    this.doLayoutForItem(screen.tiled, screen.rectangle)
  }

  public doLayoutForItem(item: IItem, rectangle: Rectangle) {
    this.layoutItem(item, rectangle)
  }

  public onCurrentDesktopChanged() {
    this.tree.currentDesktopIndex = workspace.currentDesktop - 1
    this.l.d(
      "Desktop switched to " + this.currentDesktop.name +
      " (index " + this.tree.currentDesktopIndex + ")"
    )
  }

  public onClientActivated() {
    if (workspace.activeClient === null) {
      this.tree.currentClientId = -1
      this.l.d("No active client")
    } else if (workspace.activeClient.specialWindow) {
      this.tree.currentClientId = -1
      this.l.d(
        "Active client changed to the special window " + workspace.activeClient.caption +
        " (type " + workspace.activeClient.windowType + ")")
    } else if (this.ignoredWindowClasses.indexOf(workspace.activeClient.resourceClass + "") >= 0) {
      this.tree.currentClientId = -1
      this.l.d("Active client changed to the ignored window " + workspace.activeClient.caption +
        " (class " + workspace.activeClient.resourceClass + ")")
    } else {
      this.tree.currentClientId = workspace.activeClient.windowId
      this.l.d("Active client changed to " + this.currentClient.caption +
        " (windowId " + this.tree.currentClientId + ", type " + workspace.activeClient.windowType + ")")
    }
  }

  public onClientAdded(client: KWinClient) {
    const c = new Client(client)
    const activities = client.activities.length > 0 ? client.activities : this.tree.activities.map((a) => a.id)
    for (const activityId of activities) {
      const activity = this.tree.activityWithId(activityId)
      if (activity === null) {
        this.l.e("Activity with id " + activityId + " not found")
      }
      const desktop = activity.desktops[client.desktop - 1]
      const screen = desktop.screens[client.screen]
      screen.tiled.add(c)
      this.l.d("Added client " + c.caption + " to activity " + activityId + " at desktop " + desktop.name + " on screen " + client.screen)
      if (this.autoTiling) {
        this.doLayoutForItem(screen.tiled, screen.rectangle)
      }
    }
  }

  public onClientRemoved(client: KWinClient) {
    const c = this.tree.clientWithWindowId(client.windowId)
    //assert(c !== null, "Removed client not found") // TODO: Reenable after assert implementation
    for (const screen of this.tree.allScreens) {
      const index = screen.floating.indexOf(c)
      if (index >= 0) {
        screen.floating.splice(index, 1)
        this.l.d("Removed floating client " + c.caption)
      }
    }
    const parents = this.tree.parentItems(c)
    this.l.d(parents.length + " parents found for client " + c.caption)
    for (const parent of parents) {
      if (isContainer(parent)) {
        parent.remove(c)
        this.l.d("Removed client " + c.caption)
      }
      if (this.autoTiling) {
        this.doLayoutForItem(parent, parent.rectangle)
      }
    }
  }

  public onClientMinimizeSet(client: KWinClient, m: boolean) {
    const c = this.tree.clientWithWindowId(client.windowId)
    const parents = this.tree.parentItems(c)
    // TODO: Autolayout stuff
  }

  public onClientMaximizeSet(client: KWinClient, h: boolean, v: boolean) {
    const c = this.tree.clientWithWindowId(client.windowId)
    c.maximizedH = h
    c.maximizedV = v
  }

  public onCurrentActivityChanged(id: string) {
    this.tree.currentActivityIndex = this.tree.activityIndex(id)
    this.l.d(
      "Activity switched to " + this.currentActivity +
      " (index " + this.tree.currentActivityIndex + ")"
    )
  }

  public layoutItem(item: IItem, rectangle: Rectangle, leaveMargins: boolean = true) {
    function rectangleToString(r: Rectangle) {
      return JSON.stringify(r)
    }

    function isIncluded(item: IItem): boolean {
      if (isClient(item)) {
        return !item.minimized && !item.maximizedH && !item.maximizedV
      }
      return false
    }

    if (isContainer(item)) {
      item.rectangle = rectangle
      if (item instanceof HorizontalArrayContainer) {
        this.l.d("Layouting horizontal array container inside " + rectangleToString(rectangle))
        let distributed = 0
        const filteredContent = item.content
          .filter((value: ArrayContainerEntry, index: number, array: ArrayContainerEntry[]) => isIncluded(value.child))
        const includedSum = item.includedRatioSum
        for (const entry of filteredContent) {
          let rectangleForEntry: Rectangle
          if (leaveMargins) {
            rectangleForEntry = new Rectangle(
              item.rectangle.x + this.spacing + distributed,
              item.rectangle.y + this.spacing,
              (item.rectangle.w - this.spacing * (filteredContent.length + 1)) * entry.ratio / includedSum,
              item.rectangle.h - this.spacing * 2,
            )
          } else {
            rectangleForEntry = new Rectangle(
              item.rectangle.x + distributed,
              item.rectangle.y,
              (item.rectangle.w - this.spacing * (filteredContent.length - 1)) * entry.ratio / includedSum,
              item.rectangle.h,
            )
          }
          this.doLayoutForItem(entry.child, rectangleForEntry)
          distributed += rectangleForEntry.w + this.spacing
        }
      } else {
        this.l.e("Unknown container")
      }
    } else if (isClient(item)) {
      item.rectangle = rectangle
      this.l.d(
        "Resizing the client " + item.caption +
        " (windowId " + item.windowId + ") " +
        "to " + rectangleToString(item.rectangle)
      )
      item.setRectangle()
    } else {
      this.l.e("Unknown item")
    }
  }
}

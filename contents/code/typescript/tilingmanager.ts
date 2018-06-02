Qt.include("./logger.js")
Qt.include("./model.js")
Qt.include("./util.js")

class TilingManager {
  private l: Logger = new Logger("TilingManager")
  private tree: Workspace

  get currentDesktop(): Desktop {
    return this.tree.currentDesktop
  }

  public initializeModel() {
    const activityIndex = 0
    const clientList = workspace.clientList()
    this.tree = new Workspace()
    let currentActivityIndex = -1
    let currentDesktopIndex = -1

    for (const a in workspace.activities) {
      const activity = new Activity(workspace.activities[a])
      this.tree.activities.push(activity)

      for (let d = 1; d <= workspace.desktops; ++d) {
        const desktop = new Desktop(workspace.desktopName(d), (new HorizontalArrayContainer()))
        desktop.tiled.rectangle = qRectToRectangle(workspace.clientArea(0, 0, d))
        if (d === workspace.currentDesktop) {
          currentDesktopIndex = d - 1
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
            desktop.tiled.add(client)
          }
        }
        activity.desktops.push(desktop)
      }

      if (activity.id === workspace.currentActivity) {
        currentActivityIndex = activityIndex
      }
    }

    this.tree.currentActivityIndex = currentActivityIndex
    this.onCurrentDesktopChanged(currentDesktopIndex, null)
  }

  public onCurrentDesktopChanged(lastDesktop: number, client: KWinClient) {
    this.tree.currentDesktopIndex = workspace.currentDesktop - 1
    this.l.d("Desktop switched to " + this.currentDesktop.name + " (index " + this.tree.currentDesktopIndex + ")")
  }
}

Qt.include("./model.js")

class TilingManager {
  private tree: Workspace

  public initializeModel() {
    let activityIndex = 0
    const clientList = workspace.clientList()
    this.tree = new Workspace()
    this.tree.currentActivityIndex = -1
    this.tree.currentDesktopIndex = -1

    for (const a of workspace.activities) {
      const activity = new Activity(workspace.activities[a])
      this.tree.activities.push(activity)

      for (let d = 1; d <= workspace.desktops; ++d) {
        const desktop = new Desktop(workspace.desktopName(d), new HorizontalArrayContainer())
        if (d === workspace.currentDesktop) {
          this.tree.currentDesktopIndex = d
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
        this.tree.currentActivityIndex = activityIndex
      }
      ++activityIndex
    }
  }
}

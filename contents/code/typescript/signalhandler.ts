Qt.include("logger.js")

class SignalHandler {
  private l: Logger = new Logger("SignalHandler")
  private tilingManager: TilingManager
  private overlay: Overlay

  public connectSignals(tilingManager: TilingManager, overlay: Overlay) {
    this.tilingManager = tilingManager
    this.overlay = overlay

    workspace.currentDesktopChanged.connect((desktop: number, client: KWinClient) => {
      this.l.d("currentDesktopChanged(" + desktop + ", " + this.clientToString(client) + ")")
      this.tilingManager.onCurrentDesktopChanged()
    })

    workspace.clientActivated.connect((client: KWinClient) => {
      this.l.d("clientActivated(" + this.clientToString(client) + ")")
      this.tilingManager.onClientActivated()
    })

    workspace.clientAdded.connect((client: KWinClient) => {
      this.l.d("clientAdded(" + this.clientToString(client) + ")")
      this.tilingManager.onClientAdded(client)
    })

    workspace.clientRemoved.connect((client: KWinClient) => {
      this.l.d("clientRemoved(" + this.clientToString(client) + ")")
      this.tilingManager.onClientRemoved(client)
    })

    workspace.clientMinimized.connect((client: KWinClient) => {
      this.l.d("clientMinimized(" + this.clientToString(client) + ")")
      this.tilingManager.onClientMinimizeSet(client, true)
    })

    workspace.clientUnminimized.connect((client: KWinClient) => {
      this.l.d("clientUnminimized(" + this.clientToString(client) + ")")
      this.tilingManager.onClientMinimizeSet(client, false)
    })

    workspace.clientMaximizeSet.connect((client: KWinClient, h: boolean, v: boolean) => {
      this.l.d("clientMinimized(" + this.clientToString(client) + ", " + h + ", " + v + ")")
      this.tilingManager.onClientMaximizeSet(client, h, v)
    })

    workspace.screenResized.connect((screen: number) => {
      this.l.d("screenResized(" + screen + ")")
      // TODO
    })

    workspace.currentActivityChanged.connect((id: string) => {
      this.l.d("currentActivityChanged("+id+")")
      // TODO
    })
  }

  private clientToString(client: KWinClient): string {
    if (client === null) {
      return "null"
    }
    return client.windowId + ""
  }
}

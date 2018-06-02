Qt.include("logger.js")

class SignalHandler {
  private l: Logger = new Logger("SignalHandler")
  private tilingManager: TilingManager
  private overlay: Overlay

  public connectSignals(tilingManager: TilingManager, overlay: Overlay) {
    this.tilingManager = tilingManager
    this.overlay = overlay

    workspace.currentDesktopChanged.connect((desktop:number, client:KWinClient) => {
      this.l.d("currentDesktopChanged(" + desktop + ", " + client + ")")
      this.tilingManager.onCurrentDesktopChanged(desktop, client)
    })
  }
}

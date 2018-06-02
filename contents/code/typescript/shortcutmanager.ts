class ShortcutManager {
  private tilingManager: TilingManager
  private overlay: Overlay

  public registerShortcuts(tilingManager: TilingManager, overlay: Overlay) {
    this.tilingManager = tilingManager
    this.overlay = overlay

    KWin.registerShortcut(
      "Insektile: Toggle Overlay",
      "Toggles the layout overlay",
      "Meta+-",
      () => { this.toggleOverlay() }
    )
  }

  public toggleOverlay() {
    if (this.overlay.shown) {
      print("Hiding overlay")
      this.overlay.hide()
    } else {
      print("Showing overlay")
      this.overlay.showFor(this.tilingManager.currentDesktop.tiled)
    }
  }
}

Qt.include("./logger.js")

class ShortcutManager {
  private l = new Logger("ShortcutManager")
  private tilingManager: TilingManager
  private overlay: Overlay

  public registerShortcuts(tilingManager: TilingManager, overlay: Overlay) {
    this.tilingManager = tilingManager
    this.overlay = overlay

    KWin.registerShortcut(
      "Insektile-TileOnce",
      "Insektile: Trigger the layouting once",
      "Meta+T",
      () => { this.tileOnce() },
    )

    KWin.registerShortcut(
      "Insektile-OverlayToggle",
      "Insektile: Toggle the layout overlay",
      "Meta+-",
      () => { this.toggleOverlay() },
    )

    KWin.registerShortcut (
      "Insektile-Debug-PrintModel",
      "Insektile DEBUG: Print the current state of the internal model to debug",
      "Meta+Ctrl+-",
      () => { this.printModel() },
    )
  }

  private tileOnce() {
    this.l.d("Tiling once")
    this.tilingManager.doLayoutForDesktop(this.tilingManager.currentDesktop)
  }

  private toggleOverlay() {
    if (this.overlay.shown) {
      this.l.d("Hiding overlay")
      this.overlay.hide()
    } else {
      this.l.d("Showing overlay")
      this.overlay.showForDesktop(this.tilingManager.currentDesktop)
    }
  }

  private printModel() {
      print(JSON.stringify(this.tilingManager.encodedTree, null, 2));
  }
}

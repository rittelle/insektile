function initialize(): TilingManager {
    const tilingManager = new TilingManager()
    tilingManager.initializeModel()
    return tilingManager
}

function debugPrints() {
  /*
    print("this")
    print(Object.keys(this))
    print("KWin")
    print(Object.keys(KWin))
    print("workspace")
    print(Object.keys(workspace))
    print("options")
    print(Object.keys(options))
    print(KWin.PlacementArea)
    print(Object.keys(workspace.clientList()))
    print(Object.keys(workspace.clientList()[0]))
    const clients = workspace.clientList()
    for (const client of clients) {
        print(client.caption)
    }
    */
}

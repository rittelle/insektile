import QtQuick 2.0;
import org.kde.plasma.core 2.0 as PlasmaCore;
import org.kde.plasma.components 2.0 as Plasma;
import org.kde.kwin 2.0;
import "../code/generated/tilingmanager.js" as TM;
import "../code/generated/overlay.js" as O;
import "../code/generated/shortcutmanager.js" as SM;
import "../code/generated/signalhandler.js" as SH;

Item {
    // id: root

    property variant tilingManager;
    property variant overlay;
    property variant shortcutManager;
    property variant signalHandler;

    Component.onCompleted: {
                           /*
        console.log("Test 4");
        console.log(this);
        console.log(KWin.PlacementArea);
        console.log(workspace.PlacementArea);
        console.log(options.PlacementArea);
        */
        tilingManager = new TM.TilingManager();
        tilingManager.initializeModel();
        console.log(JSON.stringify(tilingManager.tree.encode(), null, 2));
        overlay = new O.Overlay(this);
        shortcutManager = new SM.ShortcutManager();
        shortcutManager.registerShortcuts(tilingManager, overlay);
        signalHandler = new SH.SignalHandler();
        signalHandler.connectSignals(tilingManager, overlay)
        //
        //Insektile.debugPrints();
    }
/*
    PlasmaCore.Dialog {
    id: dialog
    location: PlasmaCore.Types.Floating
    visible: true

    mainItem: Item {
        id: dialogItem

        width: textElement.width
        height: textElement.height

        Plasma.Label {
            id: textElement
            anchors.top: parent.top
            anchors.horizontalCenter: parent.horizontalCenter
            text: "test"
        }
      }
  }
  */
}

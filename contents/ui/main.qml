import QtQuick 2.0;
import org.kde.plasma.core 2.0 as PlasmaCore;
import org.kde.plasma.components 2.0 as Plasma;
import org.kde.kwin 2.0;
import "../code/generated/insektile.js" as Insektile;

Item {
    // id: root

    Component.onCompleted: {
                           /*
        console.log("Test 4");
        console.log(this);
        console.log(KWin.PlacementArea);
        console.log(workspace.PlacementArea);
        console.log(options.PlacementArea);
        */
        var tilingManager = Insektile.initialize();
        console.log(JSON.stringify(tilingManager.tree.encode(), null, 2));
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

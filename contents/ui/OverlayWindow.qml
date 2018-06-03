import QtQuick 2.0;
import QtQuick.Window 2.0;
import org.kde.kwin 2.0;
import org.kde.plasma.core 2.0 as PlasmaCore;
import org.kde.plasma.components 2.0 as Plasma;

PlasmaCore.Dialog {
  property int screenX
  property int screenY
  property int screenW
  property int screenH

  id: dialog
  //location: PlasmaCore.Types.Floating
  //flags: Qt.Window
  //flags: Qt.X11BypassWindowManagerHint | Qt.FramelessWindowHint
  //outputOnly: false
  //type: Qt.Window
  visible: false
  x: screenX
  y: screenY

  mainItem: Item {
    id: rootItem
    width: screenW
    height: screenH

    Plasma.TextArea {

    }

    //Plasma.Label {
    //  text: "ELTIESRGTIEN"
    //}

  }

  Component.onCompleted: {
      //KWin.registerWindow(dialog)
      dialog.visible = true
  }
}

import QtQuick 2.0;
import org.kde.plasma.core 2.0 as PlasmaCore;

PlasmaCore.Dialog {
  // You apparently can't directly set x or y from JS, therefore this workaround
  property int frameX
  property int frameY
  property int frameW
  property int frameH

  property int marginsV: Margins.left + Margins.right
  property int marginsH: Margins.top - Margins.bottom

  //id: dialog
  location: PlasmaCore.Types.Floating
  visible: true
  //windowFlags: Qt.Window
  x: frameX
  y: frameY

  mainItem: Rectangle {
    width: frameW - marginsV;
    height: frameH - marginsH;
    color: "red";
  }
}

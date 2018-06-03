import QtQuick 2.0;
import org.kde.plasma.core 2.0 as PlasmaCore;
import org.kde.plasma.components 2.0 as Plasma;

/*
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
*/
Rectangle {
  property bool isContainer;
  property bool isActive;
  property int frameX;
  property int frameY;
  property int frameW;
  property int frameH;
  property string title;

  x: frameX
  y: frameY
  width: frameW;
  height: frameH;
  color: isContainer ? "red" : "green";
  border.color: isActive ? "orange" : "black";
  border.width: 4;

  Plasma.Label {
      id: textElement
      anchors.top: parent.top
      anchors.horizontalCenter: parent.horizontalCenter
      text: title
  }

  MouseArea {
    anchors.fill: parent
    onClicked: { parent.color = 'yellow' }
  }

  //Plasma.TextArea {
  //
  //}
}

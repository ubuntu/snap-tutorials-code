import QtQuick 2.0
import Ubuntu.Components 1.3

Item {
    property alias text: content.text
    property alias image : img.source

    Column {
        anchors.fill: parent
        anchors.centerIn: parent
        spacing: units.gu(1)

        Image {
            id: img
            width: parent.width*.8
            height: parent.height*.8
            anchors.horizontalCenter: parent.horizontalCenter
            fillMode: Image.PreserveAspectFit
            antialiasing : true
        }


        Label {
            id: content
            width: parent.width*.8
            anchors.horizontalCenter: parent.horizontalCenter
            textFormat: Text.RichText
            wrapMode: Text.WordWrap
            horizontalAlignment: Text.AlignHCenter
            fontSize: "large"
            font.bold: true
            visible: true
        }
    }
}

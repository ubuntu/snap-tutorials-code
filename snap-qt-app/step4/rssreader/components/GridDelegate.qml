import QtQuick 2.0

Item {
    width: parent.width /2 * 0.9
    height: width

    Image {
        anchors.fill: parent
        anchors.centerIn: parent
        source: image
        fillMode: Image.PreserveAspectCrop        

        MouseArea {
            anchors.fill: parent
            onClicked: {
                root.clicked(model);
            }
        }

        Text {
            anchors.bottom: parent.bottom
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottomMargin: units.gu(1)
            horizontalAlignment: Text.AlignHCenter
            text: { return title.replace("[POCO摄影 - 人像]：", "");}
            clip: true
            color: "white"
            font.pixelSize: units.gu(2)
        }
    }
}

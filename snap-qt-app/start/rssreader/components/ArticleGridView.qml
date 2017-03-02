import QtQuick 2.0
import QtQuick.XmlListModel 2.0
import Ubuntu.Components 1.3

Item {
    id: root
    signal clicked(var instance)
    anchors.fill: parent

    function reload() {
        console.log('reloading')
        model.clear();
        pocoRssModel.reload()
    }

    ListModel {
        id: model
    }

    XmlListModel {
        id: pocoRssModel
        source: "http://backend.deviantart.com/rss.xml?type=deviation&q=by%3Aspyed+sort%3Atime+meta%3Aall"
        query: "/rss/channel/item[child::enclosure]"

        onStatusChanged: {
            if (status === XmlListModel.Ready) {
                for (var i = 0; i < count; i++) {
                    //  console.log("title: " + get(i).title);
                    //  console.log("published: " + get(i).published );
                    //  console.log("image: " + get(i).image);
                    console.log("image: " + get(i).content);

                    var title = get(i).title.toLowerCase();
                    var published = get(i).published.toLowerCase();
                    var content = get(i).content.toLowerCase();
                    var word = input.text.toLowerCase();

                    if ( (title !== undefined && title.indexOf( word) > -1 )  ||
                            (published !== undefined && published.indexOf( word ) > -1) ||
                            (content !== undefined && content.indexOf( word ) > -1) ) {

                        model.append({"title": get(i).title,
                                         "published": get(i).published,
                                         "content": get(i).content,
                                         "image": get(i).image
                                     })
                    }
                }
            }
        }

        XmlRole { name: "title"; query: "title/string()" }
        XmlRole { name: "published"; query: "pubDate/string()" }
        XmlRole { name: "content"; query: "description/string()" }
        XmlRole { name: "image"; query: "enclosure/@url/string()" }
    }

    GridView {
        id: gridview
        width: parent.width
        height: parent.height - inputcontainer.height
        clip: true
        cellWidth: parent.width/2
        cellHeight: cellWidth + units.gu(1)
        x: units.gu(1.2)
        model: model

        delegate: GridDelegate {}

        Scrollbar {
            flickableItem: gridview
        }
    }

    Row {
        id:inputcontainer
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
        height: units.gu(5)
        spacing:12

        Icon {
            width: height
            height: parent.height
            name: "search"
            anchors.verticalCenter:parent.verticalCenter;
        }

        TextField {
            id:input
            placeholderText: "请输入关键词搜索:"
            width:units.gu(25)
            text:""

            onTextChanged: {
                console.log("text is changed");
                reload();
            }
        }
    }
}

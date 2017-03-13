import QtQuick 2.0
import QtQuick.XmlListModel 2.0
import Ubuntu.Components 1.3

Item {
    id: root
    signal clicked(var instance)
    signal updated()
    property alias currentIndex : listView.currentIndex
    property alias model: listView.model
    property alias listview: listView

    function reload() {
        console.log('reloading')
        model.clear();
        picoRssModel.reload()
    }

    ListModel {
        id: model
    }

    PictureModel {
        id: pictureModel
    }

    XmlListModel {
        id: picoRssModel
        source: "https://www.pexels.com/rss/"
//        source: "http://www.8kmm.com/rss/rss.aspx"
//        source: "http://my.poco.cn/rss_gen/poco_rss_channel.photo.php?sub_icon=figure"
//        source: "http://geospiza-rss-feed.tumblr.com/rss"
        query: "/rss/channel/item"

        onStatusChanged: {
            console.log("data ....status: " + status + " " + errorString())

            if (status === XmlListModel.Ready) {
                console.log("it is ready")
                console.log("count: " + count)

                for (var i = 0; i < count; i++) {
                    // Let's extract the image
                    var m,
                        urls = [],
                        str = get(i).content,                            
//                        rex = rex = /<img[^>]+src=?([^"\s]+)"?\s*\/>/g;
//                        rex = rex = /<img[^>]+src='?([^'\s]+)'?\s*\/>/g; // working
                        rex = rex = /<img[^>]+src='?(.*)'\s*\/>/g;
//                      rex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/g;

//                    console.log("str: " + str);

                    while ( m = rex.exec( str ) ) {
//                        console.log("m1: " + m[1])
                        urls.push( m[1] );
                    }

                    var image = urls[0];
//                    image = image.slice(0, -1);
//                    image = image.substr(1);

//                    console.log("image: " + image)

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
                                         "image": image
                                     })
                    }
                }

                listView.currentIndex = 0
                updated()
            }
        }

        XmlRole { name: "title"; query: "title/string()" }
        XmlRole { name: "published"; query: "pubDate/string()" }
        XmlRole { name: "content"; query: "description/string()" }
    }

    UbuntuListView {
        id: listView
        anchors.fill: parent
        clip: true
        visible: true

        model: model

        delegate: ListDelegate {}

        // Define a highlight with customized movement between items.
        Component {
            id: highlightBar
            Rectangle {
                width: 200; height: 50
                color: "#FFFF88"
                y: listView.currentItem.y;
                Behavior on y { SpringAnimation { spring: 2; damping: 0.1 } }
            }
        }

        highlightFollowsCurrentItem: true

        focus: true
        // highlight: highlightBar

        Scrollbar {
            flickableItem: listView
        }

        PullToRefresh {
            onRefresh: {
                reload()
            }
        }
    }

}

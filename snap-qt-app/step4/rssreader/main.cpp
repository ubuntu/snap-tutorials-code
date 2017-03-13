#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQuickView>
#include <QStandardPaths>
#include <QDebug>
#include <QDir>
#include <QQmlNetworkAccessManagerFactory>
#include <QNetworkAccessManager>
#include <QNetworkDiskCache>

QString getCachePath()
{
    QString writablePath = QStandardPaths::
            writableLocation(QStandardPaths::DataLocation);
    qDebug() << "writablePath: " << writablePath;

    QString absolutePath = QDir(writablePath).absolutePath();
    qDebug() << "absoluePath: " << absolutePath;

    absolutePath += "/cache/";

    // We need to make sure we have the path for storage
    QDir dir(absolutePath);
    if ( dir.mkpath(absolutePath) ) {
        qDebug() << "Successfully created the path!";
    } else {
        qDebug() << "Fails to create the path!";
    }

    qDebug() << "cache path: " << absolutePath;

    return absolutePath;
}

class MyNetworkAccessManagerFactory : public QQmlNetworkAccessManagerFactory
{
public:
    virtual QNetworkAccessManager *create(QObject *parent);
};

QNetworkAccessManager *MyNetworkAccessManagerFactory::create(QObject *parent)
{
    QNetworkAccessManager *nam = new QNetworkAccessManager(parent);

    QString path = getCachePath();
    QNetworkDiskCache* cache = new QNetworkDiskCache(parent);
    cache->setCacheDirectory(path);
    nam->setCache(cache);

    return nam;
}

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    QQuickView view;

//    qDebug() << "Original factory: " << view.engine()->networkAccessManagerFactory();
//    qDebug() << "Original manager: " << view.engine()->networkAccessManager();
    QNetworkDiskCache* cache = (QNetworkDiskCache*)view.engine()->networkAccessManager()->cache();
//    qDebug() << "Original manager cache: " << cache;
    view.engine()->setNetworkAccessManagerFactory(new MyNetworkAccessManagerFactory);

    view.setSource(QUrl(QStringLiteral("qrc:///Main.qml")));
    view.setResizeMode(QQuickView::SizeRootObjectToView);
    view.show();
    return app.exec();
}


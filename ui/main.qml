import QtQuick 2.0;
import "../code/insektile.js" as Insektile;

Item {
    // id: root

    Component.onCompleted: {
        console.log("Test 2");
        Insektile.main();
    }
}

var ref = new Firebase('https://nationstatus.firebaseio.com/'),
    gui,
    app;

$(function () {

    gui = new Gui();
    app = new Vue({
        el: '#app',
        data: {
            nation: null,
            nations: []
        }
    });
    
    ref.child('nations').on('child_added', function (snapshot) {
        var nation = Nation.fromSnapshot(snapshot);
        gui.setMarker(nation);
        app.nations.push(nation);
    });
    
    ref.child('nations').on('child_changed', function(snapshot, prevChildId) {
        var newNation = Nation.fromSnapshot(snapshot);
        app.nations.some(function (nation) {
            if (nation.id === newNation.id) {
                nation.name = newNation.name;
                nation.currentVisitors = newNation.currentVisitors;
                nation.maxVisitors = newNation.maxVisitors;
                gui.setMarker(nation);
                return true;
            }
        });
    });

    ref.child('nations').on('child_removed', function (snapshot) {
        var id = Nation.fromSnapshot(snapshot);
        app.nations.some(function (nation) {
            if (nation.id === id) {
                app.nations.$remove(nation);
                return true;
            }
        });
    });

});


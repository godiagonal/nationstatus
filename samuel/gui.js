function Gui() {

    var self = this,
        $nationListView = document.getElementById('nation-list-view'),
        $nationMapView = document.getElementById('nation-map-view'),
        $nationMap = document.getElementById('nation-map'),
        openInfoWindow,
        watchLocation,
        currentLocation,
        currentLocationMarker;
    
    var init = function () {
        
        if ('geolocation' in navigator) {
            
            watchLocation = navigator.geolocation.watchPosition(function(position) {
                currentLocation = position.coords;
                self.setDeviceMarker();
                self.calculateDistance(app.nation);
            });
            
        }
        
    }
    
    this.map;
    
    this.showListView = function () {
        $nationListView.show();
        $nationMapView.hide();
    }
    
    this.showMapView = function () {
        $nationMapView.show();
        $nationListView.hide();
    }

    this.initMap = function () {
        
        this.map = new google.maps.Map($nationMap, {
            center: {
                lat: 59.855,
                lng: 17.634
            },
            zoom: 15,
            disableDefaultUI: true
        });

    }
    
    this.setDeviceMarker = function () {
        
        if (!currentLocationMarker) {
            
            currentLocationMarker = new google.maps.Marker({
                map: this.map,
                position: {
                    lat: currentLocation.latitude,
                    lng: currentLocation.longitude
                },
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: 'blue',
                    fillOpacity: 0.8,
                    scale: 10,
                    strokeColor: 'white',
                    strokeWeight: 2
                }
            });
            
            /*this.map.panTo(new google.maps.LatLng(
                currentLocation.latitude,
                currentLocation.longitude));*/

        }
        else {
            
            currentLocationMarker.position.lat = currentLocation.latitude;
            currentLocationMarker.position.lng = currentLocation.longitude;
            
        }
        
    }
    
    this.setMarker = function (nation) {
        
        if (!nation)
            return;
        
        this.removeMarker(nation);
        this.addMarker(nation);
        
    }
    
    this.addMarker = function (nation) {

        if (!nation)
            return;
        
        var fillColor = 'green';
        if (nation.getVisitorStatus() === 'full')
            fillColor = 'red';
        else if (nation.getVisitorStatus() === 'almost-full')
            fillColor = 'orange';
        
        nation.marker = new google.maps.Marker({
            title: nation.name,
            map: this.map,
            position: {
                lat: nation.location.latitude,
                lng: nation.location.longitude
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: fillColor,
                fillOpacity: 0.8,
                scale: 8,
                strokeColor: 'white',
                strokeWeight: 2
            },
            nation: nation
        });
        
        nation.marker.addListener('click', function(e) {
            self.selectNation(this.nation, false);
        });

    }
    
    this.removeMarker = function (nation) {
        
        if (!nation || !nation.marker)
            return;
        
        nation.marker.setMap(null);
        nation.marker = null;
        
    }
    
    this.selectNation = function (nation, center) {
        
        if (!nation)
            return;
        
        this.openNationInfoWindow(nation);
        this.calculateDistance(nation);
        
        if (center)
            this.centerOnNation(nation);
        
        app.nation = nation;
        
    }
    
    this.openNationInfoWindow = function (nation) {
        
        if (!nation)
            return;
        
        if (openInfoWindow)
            openInfoWindow.close();
        
        openInfoWindow = new google.maps.InfoWindow({
            content: nation.name
        });
        
        openInfoWindow.open(this.map, nation.marker);
        
    }
    
    this.centerOnNation = function (nation) {
        
        if (!nation)
            return;
        
        this.map.panTo(new google.maps.LatLng(
            nation.location.latitude,
            nation.location.longitude));
        
    }
    
    this.calculateDistance = function (nation) {
        
        if (!nation || !nation.location || !currentLocation)
            return;
        
        console.log('2: ' + nation.location.latitude);
        
        var start = new google.maps.LatLng(
            currentLocation.latitude,
            currentLocation.longitude);
        
        var end = new google.maps.LatLng(
            nation.location.latitude,
            nation.location.longitude);
        
        nation.distance = (google.maps.geometry.spherical.computeDistanceBetween(start, end)).toFixed(0);

        console.log('3: ' + nation.distance);
        
    }
    
    init();
    
}
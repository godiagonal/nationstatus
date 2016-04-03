function Nation(id, name, currentVisitors, maxVisitors, location, image) {
    
    this.id = id;
    this.name = name;
    this.currentVisitors = currentVisitors;
    this.maxVisitors = maxVisitors;
    this.location = location;
    this.image = image;
    this.mapMarker;
    this.distance;
    
    this.getVisitorQuota = function () {
        return (this.currentVisitors / this.maxVisitors);
    }
    
    this.getVisitorStatus = function () {
        if (this.getVisitorQuota() > 0.9) return 'full';
        if (this.getVisitorQuota() > 0.7) return 'almost-full';
        return 'ok';
    }
    
}

Nation.fromSnapshot = function(snapshot) {
    
    return new Nation(
        snapshot.key(),
        snapshot.val().name,
        snapshot.val().currentVisitors,
        snapshot.val().maxVisitors,
        new Location(
            snapshot.val().location.latitude,
            snapshot.val().location.longitude),
        snapshot.val().image);
    
}
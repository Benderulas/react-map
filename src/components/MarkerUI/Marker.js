export function createMarker(map, google, position) {
    const marker = new google.maps.Marker({
        position: position,
        icon: { 
            path: "M -6 4 L 6 4 L 0 -8 Z",
            strokeColor: "#F00",
            fillColor: "#F00",
            fillOpacity: 1,
            scale: 1,
            rotation: 90,
        },
        title: "Hello World!",
        zIndex: 999,
        draggable: false,
        clickable: true,
        map: map,
    });

    const infowindow = new google.maps.InfoWindow({
        content: `lat: ${position.lat}, lng: ${position.lng}`,
        ariaLabel: "Uluru",
    });

    marker.addListener('position_changed', _ => {
        const newPosition = marker.getPosition();
        infowindow.setContent(`lat: ${newPosition.lat()}, lng: ${newPosition.lng()}`)
    })

    marker.addListener('click', _ => {
        infowindow.open({
            anchor: marker,
            map: map,
        })
    })

    return marker;
}

export function hideMarker(marker) {
    marker.setVisible(false);
}

export function showMarker(marker) {
    marker.setVisible(true);
}

export function unbindMap(marker) {
    marker.setMap(null);
}

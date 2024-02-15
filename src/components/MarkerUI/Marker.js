export function createMarker(map, google, position) {
    const marker = new google.maps.Marker({
        position: position,
        icon: 'http://s1.iconbird.com/ico/0612/MustHave/w16h161339196030StockIndexUp16x16.png',
        title: "Hello World!",
        zIndex: 999,
        draggable: true,
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

import { useEffect, useState } from 'react'
import './MarkerUI.css'

function calcLatLng(map, mapRef, scaleRef, event) {
    var bounds = map.getBounds();
    var topRight = bounds.getNorthEast();
    var bottomLeft = bounds.getSouthWest();

    const width = mapRef.current.offsetWidth;
    const height = mapRef.current.offsetHeight;

    const lng_base = bottomLeft.lng();
    const lat_base = topRight.lat();

    const widthpx = (topRight.lng() - bottomLeft.lng()) / width;
    const heightpx = (bottomLeft.lat() - topRight.lat()) / height;

    const new_x = event.domEvent.x / scaleRef.current + width * (1 - 1 / scaleRef.current) / 2;
    const new_y = event.domEvent.y / scaleRef.current + height * (1 - 1 / scaleRef.current) / 2;

    return {
        lng: lng_base + new_x * widthpx,
        lat: lat_base + new_y * heightpx,
    }
}


function MarkerUI ({map, mapRef, scaleRef, google}) {
    const [addMarkerFlag, setAddMarkerFlag] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [mapClickListener, setMapClickListener] = useState(null);


    function addHandler() {
        setAddMarkerFlag(!addMarkerFlag);
    }

    useEffect(_ => {
        if (mapClickListener !== null) {
            google.maps.event.removeListener(mapClickListener);
        }

        if (map === null || google === null) {
            return
        }

        if (addMarkerFlag) {            
            setMapClickListener(map.addListener('click', (event) => {
                const newMarker = new google.maps.Marker({
                    position: calcLatLng(map, mapRef, scaleRef, event),
                    icon: 'http://s1.iconbird.com/ico/0612/MustHave/w16h161339196030StockIndexUp16x16.png',
                    title: "Hello World!",
                    zIndex: 999,
                    draggable: true,
                    clickable: true,
                    map: map,
                  });

                setMarkers([...markers, newMarker]);
            }))
        }
    }, [markers, addMarkerFlag]);

    function setVisibleForAll(visible) {
        markers.forEach(marker => marker.setVisible(visible));
    }

    function hideHandler() {
        setVisibleForAll(false);
    }

    function showHandler() {
        setVisibleForAll(true);
    }

    function delHanlder() {
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);
    }



    return (
        <div className="marker-ui">
            <button 
                className={'btn ' +  (addMarkerFlag ? 'btn-active' : '')}
                onClick={addHandler}
            >
                Add
            </button>
            <button
                className='btn'
                onClick={hideHandler}
            >
                Hide
            </button>
            <button 
                className='btn'
                onClick={showHandler}
            >
                Show
            </button>
            <button 
                className='btn'
                onClick={delHanlder}
            >
                Del
            </button>
        </div>
    )
}

export default MarkerUI

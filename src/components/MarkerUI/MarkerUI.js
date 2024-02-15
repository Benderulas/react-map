import { useEffect, useRef, useState } from 'react'
import './MarkerUI.css'
import { createMarker, hideMarker, showMarker, unbindMap } from './Marker';

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
    const markersRef = useRef([]);

    useEffect(_ => {
        markersRef.value = markers;
    }, [markers])

    useEffect(_ => {
        if (mapClickListener !== null) {
            google.maps.event.removeListener(mapClickListener);
        }

        if (map === null || google === null) {
            return;
        }

        if (addMarkerFlag) {            
            setMapClickListener(map.addListener('click', (event) => {
                const worldPosition = calcLatLng(map, mapRef, scaleRef, event);
                const newMarker = createMarker(map, google, worldPosition);

                setMarkers([...markers, newMarker]);
            }))
        }
    }, [markers, addMarkerFlag]);

    function addHandler() {
        setAddMarkerFlag(!addMarkerFlag);
    }

    function hideHandler() {
        markers.forEach(marker => {
            hideMarker(marker);
        })
    }

    function showHandler() {
        markers.forEach(marker => {
            showMarker(marker);
        })
    }

    function delHanlder() {
        markers.forEach(marker => unbindMap(marker));
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

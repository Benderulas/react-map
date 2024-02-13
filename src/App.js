import {Loader, LoaderOptions} from 'google-maps';
import { useState, useEffect, useRef } from 'react';
import './App.css';

const GOOGLE_API_KEY = 'AIzaSyBuOglV9VCd8IBixqHKgC87HtX7IQ3Gdoo';
const DEFAULT_MAP_CENTER = { lat: 43.261001, lng: 28.029099 };
const GOOGLE_MAP_ID = "d6da02314df5661e";
const SCALE_MULTIPLICATOR = 1.1;
const SCROLL_TYPE = {
	UP: 'UP',
	DOWN: 'DOWN',
}
const ZOOM_TYPE = {
	GOOGLE: 'GOOGLE',
	CUSTOM: 'CUSTOM',
	HYBRID: 'HYBRID',
}


function App() {
	const mapRef = useRef(null);
	const [google, setGoogle] = useState(null);
	const [map, setMap] = useState(null);
	const [maxZoomService, setMaxZoomService] = useState(null);
	const [center, setCenter] = useState(DEFAULT_MAP_CENTER)
	const [scale, setScale] = useState(1);
	const [zoom, setZoom] = useState(20);
	const [maxZoom, setMaxZoom] = useState(21);
	const [zoomType, setZoomType] = useState(ZOOM_TYPE.GOOGLE);

	const options = {libraries: ["maps", "marker"]};

	useEffect(_ => {
        if (google === null) {
            const loader = new Loader(GOOGLE_API_KEY, options);
            loader.load().then(google => {setGoogle(google)});
        }
    }, [google]);

	useEffect(_ => {

        if (google != null && mapRef !== null && map === null) {
            var mapOptions = {
                tilt: 0,
                heading: 0,
                zoom: 20,
                center: DEFAULT_MAP_CENTER,
                mapId: GOOGLE_MAP_ID,
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP]
                },
                disableDefaultUI: false,
                keyboardShortcuts: true,
                scaleControl: true,
                zoomControl: false,
                rotateControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeId: google.maps.MapTypeId.HYBRID,
				options: {
					gestureHandling: 'auto'
				}
            };

			const newMap = new google.maps.Map(mapRef.current, mapOptions);
			const marker = new google.maps.Marker({
				position: DEFAULT_MAP_CENTER,
				icon: 'http://s1.iconbird.com/ico/0612/vistabasesoftwareicons/w24h241339252457BoxOrange6.png',
				title: "Hello World!",
				zIndex: 999,
			  });
			marker.setMap(newMap);
			newMap.addListener('zoom_changed', _ => {
				setZoom(newMap.getZoom());
			})
			newMap.addListener('center_changed', _ => {
				const newCenter = newMap.getCenter()

				setCenter({
					lat: newCenter.lat(),
					lng: newCenter.lng(),
				});
			})

            setMap(newMap);
			setMaxZoomService(new google.maps.MaxZoomService());
        }
    }, [mapRef, google, map, setMap]);

	useEffect(_ => {
		if (maxZoomService !== null) {
			maxZoomService.getMaxZoomAtLatLng(center)
				.then((response) => {
					setMaxZoom(response.zoom);
				});
		}
	}, [maxZoomService, center])

	useEffect(_ => {
		const wrapper = async () => {
			if (maxZoom <= zoom && scale === 1 && zoomType !== ZOOM_TYPE.HYBRID) {
				map.setOptions({
					scrollwheel: true,
				});
	
				setZoomType(ZOOM_TYPE.HYBRID);
			} else if (maxZoom > zoom && zoomType !== ZOOM_TYPE.GOOGLE) {
				map.setOptions({
					scrollwheel: true,
				});
	
				setZoomType(ZOOM_TYPE.GOOGLE);
			} else if (scale > 1 && zoomType !== ZOOM_TYPE.CUSTOM) {
				map.setOptions({
					scrollwheel: false,
				});
	
				setZoomType(ZOOM_TYPE.CUSTOM);
			}
		}

		if (map !== null) {
			wrapper();
		}
		
	}, [scale, zoom, maxZoom, map])

	const getScrollType = (event) => {
		if (event.deltaY === -100) {
			return SCROLL_TYPE.UP;
		} else if (event.deltaY === 100) {
			return SCROLL_TYPE.DOWN;
		} else {
			return SCROLL_TYPE.DOWN;
		}
	}

	const handleScroll = async (event) => {
		let scrollType = getScrollType(event);


		if (scrollType == SCROLL_TYPE.UP && (zoomType === ZOOM_TYPE.HYBRID || zoomType === ZOOM_TYPE.CUSTOM)){
			setScale(scale * SCALE_MULTIPLICATOR);
		} else if (scrollType == SCROLL_TYPE.DOWN && zoomType === ZOOM_TYPE.CUSTOM) {
			setScale(Math.max(scale / SCALE_MULTIPLICATOR, 1));
		}
	}

  return (
    <div 
		id="global-map" 
		className="global-map" 
		style={{transform: 'scale(' + scale + ')'}} 
		ref={mapRef}
		onWheel={handleScroll}
	>
      
    </div>
  );
}

export default App;

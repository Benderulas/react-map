import {Loader, LoaderOptions} from 'google-maps';
import { useState, useEffect, useRef } from 'react';
import './App.css';

const GOOGLE_API_KEY = 'AIzaSyBuOglV9VCd8IBixqHKgC87HtX7IQ3Gdoo';

function App() {
	const mapRef = useRef(null);
	const [google, setGoogle] = useState(null);
	const [map, setMap] = useState(null);
	const [scale, setScale] = useState(1);
	const [maxZoomService, setMaxZoomService] = useState(null);

	const options = {libraries: ["maps", "marker"]};

	useEffect(_ => {
        if (google === null) {
            const loader = new Loader(GOOGLE_API_KEY, options);
            loader.load().then(google => {setGoogle(google)});
        }
    }, [google]);

	useEffect(_ => {
		const DEFAULT_MAP_CENTER = { lat: 43.261001, lng: 28.029099 };
		const GOOGLE_MAP_ID = "d6da02314df5661e";

        if (google != null && mapRef !== null && map === null) {
            var mapOptions = {
                tilt: 0,
                heading: 0,
                zoom: 30,
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
            setMap(newMap);
			setMaxZoomService(new google.maps.MaxZoomService());
        }
    }, [mapRef, google, map, setMap]);

	const handleScroll = async (event) => {
		const SCALE_MULTIPLICATOR = 1.1;
		const SCROLL_TYPE = {
			UP: 'UP',
			DOWN: 'DOWN',
		}
		let scroll_type = null;

		if (event.deltaY === -100) {
			scroll_type = SCROLL_TYPE.UP;
		} else if (event.deltaY === 100) {
			scroll_type = SCROLL_TYPE.DOWN;
		} else {
			return;
		}
		
		const maxZoom = (await maxZoomService.getMaxZoomAtLatLng(map.getCenter())).zoom
		const currentZoom = map.getZoom();
		console.log(map.getCenter().lng(), map.getCenter().lat());

		if (scroll_type === SCROLL_TYPE.UP) {
			if (maxZoom <= currentZoom) {
				if (scale === 1) {
					map.setOptions({
						scrollwheel: false
					});
				}
				setScale(scale * SCALE_MULTIPLICATOR);
			}
		} else if (scroll_type === SCROLL_TYPE.DOWN) {
			if (scale > 1) {
				const newScale = scale / SCALE_MULTIPLICATOR;

				if (newScale <= 1) {
					setScale(1);
					map.setOptions({
						scrollwheel: true
					});
				} else {
					setScale(newScale);
				}
			}
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

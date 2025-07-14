import React, { useRef, useEffect, useState, useCallback } from 'react';
import Map, { Marker, useControl } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { MapPin } from 'lucide-react';

/*
  Helper component to correctly initialize the Geocoder using react-map-gl's
  useControl hook. This is the most reliable way to create the control.
*/
function GeocoderControl(props) {
    useControl(
        () => {
            const ctrl = new MapboxGeocoder({
                ...props,
                marker: false,
                accessToken: props.mapboxAccessToken,
            });
            // Attach event listeners
            ctrl.on('result', props.onResult);
            return ctrl;
        },
        {
            // The control is added to the map here, then we move it.
            position: 'top-left',
        }
    );

    return null;
}


const AddressPicker = ({ onAddressSelect, value, error, disabled }) => {
    const [viewport, setViewport] = useState({
        longitude: 106.7009, // Default coordinates (HCMC)
        latitude: 10.7769,
        zoom: 12,
    });
    const [marker, setMarker] = useState(null);
    const geocoderContainerRef = useRef(null);
    const mapRef = useRef(null);

    // This effect's job is to find the geocoder element (created by useControl)
    // and move it to our external container div.
    useEffect(() => {
        const moveGeocoder = () => {
            const mapContainer = mapRef.current?.getContainer();
            if (!mapContainer || !geocoderContainerRef.current) return;

            const geocoderElement = mapContainer.querySelector('.mapboxgl-ctrl-geocoder');

            // Move it only if it exists and our container is empty
            if (geocoderElement && geocoderContainerRef.current.children.length === 0) {
                geocoderContainerRef.current.appendChild(geocoderElement);
            }
        };

        // The geocoder element might take a moment to appear, so we check periodically.
        const intervalId = setInterval(() => {
            moveGeocoder();
        }, 100);

        // Stop checking after a few seconds
        setTimeout(() => clearInterval(intervalId), 2000);

        return () => {
            clearInterval(intervalId);
        };

    }, []);


    const handleResult = useCallback((event) => {
        const { result } = event;
        const longitude = result.center[0];
        const latitude = result.center[1];

        setViewport(prev => ({ ...prev, longitude, latitude, zoom: 15 }));
        setMarker({ longitude, latitude });

        if (onAddressSelect) {
            onAddressSelect({
                address: result.place_name,
                latitude,
                longitude,
            });
        }
    },
        [onAddressSelect]
    );

    const handleGetCurrentLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
                    );
                    const data = await response.json();
                    const addressText = data.features[0]?.place_name || 'Không tìm thấy tên địa chỉ';
                    setViewport((prev) => ({ ...prev, latitude, longitude, zoom: 15 }));
                    setMarker({ latitude, longitude });
                    if (onAddressSelect) {
                        onAddressSelect({ address: addressText, latitude, longitude });
                    }
                },
                (error) => {
                    // eslint-disable-next-line no-alert
                    alert('Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt.');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            // eslint-disable-next-line no-alert
            alert('Trình duyệt của bạn không hỗ trợ lấy vị trí.');
        }
    };


    return (
        <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700 flex items-center'>
                <MapPin className='w-4 h-4 mr-1 text-gray-500' /> Địa chỉ *
            </label>

            {/* Address input field */}
            <input
                type="text"
                value={value || ''}
                readOnly
                placeholder="Địa chỉ sẽ hiển thị ở đây khi bạn chọn từ bản đồ hoặc tìm kiếm"
                disabled={disabled}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors cursor-default ${
                    error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
            />

            {/* The Geocoder search bar will be moved into this div */}
            <div ref={geocoderContainerRef} className='geocoder-container' />

            <button
                type='button'
                onClick={handleGetCurrentLocation}
                disabled={disabled}
                className={`text-sm text-red-600 hover:underline ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Hoặc lấy vị trí hiện tại của bạn
            </button>
            
            <div className={`w-full h-48 rounded-lg overflow-hidden mt-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <Map
                    ref={mapRef}
                    {...viewport}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    onMove={(evt) => setViewport(evt.viewState)}
                    mapStyle='mapbox://styles/mapbox/streets-v12'
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* This component creates the geocoder and adds it to the map */}
                    <GeocoderControl
                        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                        onResult={handleResult}
                        placeholder="Nhập địa chỉ để tìm kiếm..."
                        types="country,region,place,postcode,locality,neighborhood,address"
                    />
                    {marker && (
                        <Marker longitude={marker.longitude} latitude={marker.latitude} />
                    )}
                </Map>
            </div>
            
            {/* Display error message */}
            {error && (
                <p className='text-xs text-red-600'>
                    {error}
                </p>
            )}
        </div>
    );
};

export default AddressPicker;
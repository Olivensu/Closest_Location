"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import styled from '@emotion/styled';


export function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
}


const locations = [
    { "id": 1, "name": "Joe's Pizza", "latitude": 40.730610, "longitude": -73.935242 },
    { "id": 2, "name": "The Burger Joint", "latitude": 34.052235, "longitude": -118.243683 },
    { "id": 3, "name": "The Fish House", "latitude": 51.507351, "longitude": -0.127758 },
    { "id": 4, "name": "Curry Palace", "latitude": 23.810331, "longitude": 90.412521 },
    { "id": 5, "name": "Shawarma King", "latitude": 31.768318, "longitude": 35.21371 },
    { "id": 6, "name": "Mumbai Spice", "latitude": 19.076090, "longitude": 72.877426 },
    { "id": 7, "name": "Big Ben Pub", "latitude": 51.509865, "longitude": -0.118092 },
    { "id": 8, "name": "Bengal Delight", "latitude": 22.572645, "longitude": 88.363892 },
    { "id": 9, "name": "Le Gourmet", "latitude": 48.856613, "longitude": 2.352222 },
    { "id": 10, "name": "South Indian Delight", "latitude": 13.082680, "longitude": 80.270721 },
    { "id": 11, "name": "Delhi Darbar", "latitude": 28.704060, "longitude": 77.102493 },
    { "id": 12, "name": "Peking Duck House", "latitude": 39.904202, "longitude": 116.407394 },
    { "id": 13, "name": "Sushi World", "latitude": 35.689487, "longitude": 139.691711 },
    { "id": 14, "name": "Golden Gate Grill", "latitude": 37.774929, "longitude": -122.419418 },
    { "id": 15, "name": "Moscow Mule", "latitude": 55.755825, "longitude": 37.617298 },
    { "id": 16, "name": "Berlin Brats", "latitude": 52.520008, "longitude": 13.404954 },
    { "id": 17, "name": "Romeo's Pizza", "latitude": 41.902782, "longitude": 12.496366 },
    { "id": 18, "name": "Sydney Seafood", "latitude": -33.868820, "longitude": 151.209290 },
    { "id": 19, "name": "Brazilian BBQ", "latitude": -23.550520, "longitude": -46.633308 },
    { "id": 20, "name": "LA Street Tacos", "latitude": 34.052235, "longitude": -118.243683 }
];

const mapContainerStyle = {
    width: '100%',
    height: '100vh',
};

const center = {
    lat: 23.685,
    lng: 90.3563,
};

const Sidebar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;
  z-index: 10;
  background-color: seagreen;
`;

const ListItem = styled.div`
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
`;

const ListHeader = styled.h2`
  margin: 0 0 20px 0;
  padding: 0;
  font-size: 24px;
`;

const userMarkerIcon = {
    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
};

export default function Home() {
    const [userLocation, setUserLocation] = useState(center);
    const [closestLocations, setClosestLocations] = useState([]);

    const updateClosestLocations = useCallback((lat, lng) => {
        const distances = locations.map(location => ({
            ...location,
            distance: haversineDistance(lat, lng, location.latitude, location.longitude)
        }));
        distances.sort((a, b) => a.distance - b.distance);
        setClosestLocations(distances.slice(0, 5));
    }, []);

    useEffect(() => {
        updateClosestLocations(userLocation.lat, userLocation.lng);
    }, [userLocation, updateClosestLocations]);

    const handleDragEnd = (e) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setUserLocation({ lat: newLat, lng: newLng });
        updateClosestLocations(newLat, newLng);
    };

    return (
        <div style={{ position: 'relative', display: 'flex' }}>
            <Sidebar>
                <ListHeader><p className='font-bold'>Closest Locations</p></ListHeader>
                {closestLocations.map(location => (
                    <ListItem key={location.id}>
                        <div className='bg-gray-200 p-5'>
                            <h3 className='font-bold text-xl'>{location.name}</h3>
                            <p>Distance: <span className='text-red-600'>{location.distance.toFixed(2)} km</span></p>
                        </div>
                    </ListItem>
                ))}
            </Sidebar>
            <LoadScript googleMapsApiKey="AIzaSyBEHCdvSJx0OAfeOp-MkfXBXVMzOrH64OY">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={userLocation}
                    zoom={8}
                >
                    <Marker
                        position={userLocation}
                        draggable={true}
                        onDragEnd={handleDragEnd}
                        icon={userMarkerIcon}
                    />
                    <Circle
                        center={userLocation}
                        radius={5000} 
                        options={{
                            fillColor: "rgba(0, 123, 255, 0.2)",
                            strokeColor: "#007bff",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            clickable: false,
                            draggable: false,
                            editable: false,
                            visible: true
                        }}
                    />
                    {locations.map(location => (
                        <Marker
                            key={location.id}
                            position={{ lat: location.latitude, lng: location.longitude }}
                            title={location.name}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries } from './API';

const App = () => {
	const [logEntries, setLogEntries] = useState([]);
	const [showPopup, setShowPopup] = useState({});
	const [addEntryLocation, setAddEntryLocation] = useState(null);
	const [viewport, setViewport] = useState({
		width: '100vw',
		height: '100vh',
		latitude: 22.583,
		longitude: 88.3373,
		zoom: 9
	});
	useEffect(() => {
		//can't use async in effect , will cause race condition
		//Create an iife -Immediately Invoked Function Expression
		/* (function () {
			statements
		})(); or  (()=>{})() */
		(async () => {
			const logEntries = await listLogEntries();
			setLogEntries(logEntries);
		})();
	}, []);

	const showAddMarkerPopup = event => {
		const [longitude, latitude] = event.lngLat;
		setAddEntryLocation({
			longitude,
			latitude
		});
	};

	return (
		<ReactMapGL
			{...viewport}
			onDblClick={showAddMarkerPopup}
			mapStyle='mapbox://styles/agni-c/ck8d4mddc2hmo1iqq8n2hmio3'
			onViewportChange={setViewport}
			mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}>
			{/* Impliminting markers from state */}
			{logEntries.map(entry => (
				<>
					<Marker
						key={entry._id}
						latitude={entry.latitude}
						longitude={entry.longitude}
						offsetLeft={-14}
						offsetTop={-28}>
						<div
							onClick={() =>
								setShowPopup({
									// ...showPopup
									[entry._id]: true
								})
							}>
							<svg
								className='map-pin'
								viewBox='0 0 24 24'
								width='28px'
								height='28px'
								stroke-width='2'
								fill='none'
								stroke-linecap='round'
								stroke-linejoin='round'>
								<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
								<circle cx='12' cy='10' r='3'></circle>
							</svg>
						</div>
					</Marker>
					{//bracket  notation
					showPopup[entry._id] ? (
						<Popup
							className='popup'
							latitude={entry.latitude}
							longitude={entry.longitude}
							anchor='top'
							dynamicPosition={true}
							onClose={() => setShowPopup({})}>
							<div>
								<h3>{entry.title}</h3>
								<p>hey</p>
							</div>
						</Popup>
					) : null}
				</>
			))}
			{addEntryLocation ? (
				<>
					<Marker
						latitude={addEntryLocation.latitude}
						longitude={addEntryLocation.longitude}
						offsetLeft={-14}
						offsetTop={-28}>
						<svg
							className='map-pin'
							viewBox='0 0 24 24'
							width='28px'
							height='28px'
							stroke-width='2'
							fill='none'
							stroke-linecap='round'
							stroke-linejoin='round'>
							<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
							<circle cx='12' cy='10' r='3'></circle>
						</svg>
					</Marker>
					<Popup
						className='popup'
						latitude={addEntryLocation.latitude}
						longitude={addEntryLocation.longitude}
						anchor='top'
						closeOnClick={false}
						dynamicPosition={true}
						onClose={() => setAddEntryLocation(null)}>
						<div>
							<h3>Enter your journy here</h3>
						</div>
					</Popup>
				</>
			) : null}
		</ReactMapGL>
	);
};
export default App;

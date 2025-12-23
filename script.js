const map = L.map('map').setView([37.2154, 28.3636], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let routingControl = null;
let waypoints = [];

initRouting();

function initRouting() {
    if (routingControl) map.removeControl(routingControl);

    routingControl = L.Routing.control({
        waypoints: waypoints,
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'driving'
        }),
        lineOptions: {
            styles: [{ color: '#007bff', opacity: 0.8, weight: 6 }]
        },
        createMarker: function(i, wp, nWps) {
            return L.marker(wp.latLng, { draggable: true })
                .bindPopup(`Node ${i + 1}`);
        },
        addWaypoints: false,
        showAlternatives: false,
        fitSelectedRoutes: true
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
        let routes = e.routes;
        let summary = routes[0].summary;
        let instructions = routes[0].instructions;
        
        let km = (summary.totalDistance / 1000).toFixed(1);
        let mins = Math.round(summary.totalTime / 60);

        document.getElementById('route-stats').style.display = 'block';
        document.getElementById('dist-val').innerText = `${km} km`;
        document.getElementById('time-val').innerText = `${mins} min`;

        const stepsContainer = document.getElementById('steps-container');
        const stepsList = document.getElementById('steps-list');
        stepsContainer.style.display = 'block';
        stepsList.innerHTML = ""; 

        instructions.forEach(step => {
            let li = document.createElement('li');
            let dist = step.distance > 1000 
                ? (step.distance / 1000).toFixed(1) + ' km' 
                : Math.round(step.distance) + ' m';
            
            let text = step.text ? step.text : "Continue";
            li.innerHTML = `<span>${text}</span> <span style="color:#666; font-size:0.8em;">(${dist})</span>`;
            stepsList.appendChild(li);
        });
    });
}

map.on('click', function(e) {
    const newPoint = L.latLng(e.latlng.lat, e.latlng.lng);
    waypoints.push(newPoint);
    routingControl.setWaypoints(waypoints);
});

function clearRoute() {
    waypoints = [];
    routingControl.setWaypoints([]);
    document.getElementById('route-stats').style.display = 'none';
    document.getElementById('steps-container').style.display = 'none';
    document.getElementById('dist-val').innerText = '0 km';
    document.getElementById('time-val').innerText = '0 min';
}
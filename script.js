let graphData = null;
const map = L.map('map').setView([37.1, 28.3], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

let markers = {};
let currentPathLine = null;
let selectedNodes = [];
let isAddMode = false;

fetch('graph-data.json')
    .then(response => response.json())
    .then(data => {
        graphData = data;
        initMarkers();
    })
    .catch(error => console.error('Error loading graph data:', error));

function initMarkers() {
    if (!graphData) return;
    for (let key in markers) map.removeLayer(markers[key]);
    markers = {};
    graphData.nodes.forEach(nodeName => createMarker(nodeName, graphData.coordinates[nodeName]));
}

function createMarker(name, coords) {
    const marker = L.marker(coords).addTo(map);
    marker.bindPopup(`<b>${name}</b>`);
    marker.on('click', () => { if (!isAddMode) handleNodeClick(name); });
    markers[name] = marker;
}

map.on('click', function(e) {
    if (isAddMode) {
        const name = prompt("Enter the name of the new location:", "New Place");
        if (name && !graphData.nodes.includes(name)) addNewNode(name, e.latlng);
    }
});

function toggleAddMode() {
    isAddMode = !isAddMode;
    const btn = document.getElementById('addModeBtn');
    btn.innerText = isAddMode ? "Exit Add Mode" : "Add New Location";
    btn.classList.toggle("active-mode", isAddMode);
    document.getElementById('status').innerText = isAddMode ? "Click on the map to add a new location." : "Please select a Start Point (A)";
}

function addNewNode(name, latlng) {
    graphData.nodes.push(name);
    graphData.coordinates[name] = [latlng.lat, latlng.lng];
    graphData.edges[name] = [];
    let distances = [];
    graphData.nodes.forEach(target => {
        if (target !== name) {
            const dist = heuristic(name, target);
            distances.push({ node: target, dist: dist });
        }
    });
    distances.sort((a, b) => a.dist - b.dist);
    for (let i = 0; i < Math.min(2, distances.length); i++) {
        let neighbor = distances[i].node;
        let weight = Math.round(distances[i].dist);
        graphData.edges[name].push({ node: neighbor, weight: weight });
        if (!graphData.edges[neighbor]) graphData.edges[neighbor] = [];
        graphData.edges[neighbor].push({ node: name, weight: weight });
    }
    createMarker(name, [latlng.lat, latlng.lng]);
    alert(`${name} added!`);
    toggleAddMode();
}

function handleNodeClick(nodeName) {
    if (selectedNodes.length === 0) {
        selectedNodes.push(nodeName);
        document.getElementById('status').innerText = `Start: ${nodeName}. Select Destination (B).`;
        markers[nodeName].openPopup();
    } else if (selectedNodes.length === 1) {
        if (selectedNodes[0] === nodeName) return;
        selectedNodes.push(nodeName);
        const algoType = document.getElementById('algorithm').value;
        let result = runPathfinding(selectedNodes[0], selectedNodes[1], algoType === 'astar');

        if (result) {
            drawPath(result.path);
            const travelTime = Math.round((result.distance / 70) * 60);
            document.getElementById('status').innerHTML = `
                <div><strong>Route:</strong> ${result.path.join(" ➝ ")} <br>
                <strong>Distance:</strong> ${result.distance} km | <strong>Time:</strong> ${travelTime} min</div>`;
            document.getElementById('stats').style.display = 'block';
            document.getElementById('stats-text').innerText = `Algorithm: ${algoType.toUpperCase()} | Visited Nodes: ${result.visitedCount}`;
        }
    }
}

function drawPath(pathNodes) {
    if (currentPathLine) map.removeLayer(currentPathLine);
    const latlngs = pathNodes.map(node => graphData.coordinates[node]);
    currentPathLine = L.polyline(latlngs, { color: 'blue', weight: 5, dashArray: '10, 10' }).addTo(map);
    map.fitBounds(currentPathLine.getBounds());
}

function resetSelection() {
    selectedNodes = [];
    isAddMode = false;
    document.getElementById('addModeBtn').classList.remove("active-mode");
    document.getElementById('stats').style.display = 'none';
    if (currentPathLine) map.removeLayer(currentPathLine);
    document.getElementById('status').innerText = "Please select a Start Point (A)";
}
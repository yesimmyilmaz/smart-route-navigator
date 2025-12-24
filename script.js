var map = L.map('map').setView([37.2153, 28.3636], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = [];
let routeLine;

map.on('click', function (e) {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;

  let marker = L.marker([lat, lng]).addTo(map);
  markers.push(marker);

  if (markers.length >= 2) {
    calculateRoute();
  }
});

async function calculateRoute() {
  let coords = markers.map(m => `${m.getLatLng().lng},${m.getLatLng().lat}`).join(';');
  let url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true`;

  try {
    let response = await fetch(url);
    let data = await response.json();

    if (data.code === 'Ok') {
      let route = data.routes[0];

      document.getElementById('distance').innerText =
        (route.distance / 1000).toFixed(2) + " km";
      document.getElementById('time').innerText =
        Math.max(1, Math.round(route.duration / 60)) + " min";

      if (routeLine) map.removeLayer(routeLine);
      routeLine = L.geoJSON(route.geometry, {
        style: { color: '#e74c3c', weight: 5, opacity: 0.7 }
      }).addTo(map);

      updateDirections(route.legs);
    } else {
      console.error("OSRM error:", data);
    }
  } catch (err) {
    console.error("Route error:", err);
  }
}

function buildEnglishInstruction(step) {
  const m = step.maneuver || {};
  const type = (m.type || "").toLowerCase();
  const modifier = (m.modifier || "").toLowerCase();

  const road = (step.name && step.name.trim().length > 0) ? step.name.trim() : "";
  const roadText = road ? ` onto ${road}` : "";

  const modifiersEN = {
    left: "left",
    right: "right",
    straight: "straight",
    slight_left: "slight left",
    slight_right: "slight right",
    sharp_left: "sharp left",
    sharp_right: "sharp right",
    uturn: "U-turn",
  };

  const turnDir = modifiersEN[modifier] || "";

  switch (type) {
    case "depart":
      return `Head ${turnDir} from the starting point`;
    case "arrive":
      return `You have arrived at your destination`;
    case "turn":
      if (turnDir) return `Turn ${turnDir}${roadText}`;
      return `Make a turn${roadText}`;
    case "continue":
      return `Continue straight${road ? " on " + road : ""}`;
    case "new name":
      return `Continue${road ? " on " + road : ""}`;
    case "merge":
      return `Merge${roadText}`;
    case "on ramp":
      return `Take the ramp${roadText}`;
    case "off ramp":
      return `Take the exit${roadText}`;
    case "fork":
      if (turnDir) return `Keep ${turnDir} at the fork${roadText}`;
      return `Take the fork${roadText}`;
    case "roundabout":
    case "rotary":
      if (typeof m.exit === "number") return `At the roundabout, take the ${getOrdinal(m.exit)} exit${roadText}`;
      return `Enter the roundabout${roadText}`;
    case "roundabout turn":
      if (typeof m.exit === "number") return `At the roundabout, take the ${getOrdinal(m.exit)} exit${roadText}`;
      if (turnDir) return `Turn ${turnDir} at the roundabout${roadText}`;
      return `Go through the roundabout${roadText}`;
    case "exit roundabout":
      if (typeof m.exit === "number") return `Exit the roundabout at the ${getOrdinal(m.exit)} exit${roadText}`;
      return `Exit the roundabout${roadText}`;
    case "end of road":
      if (turnDir) return `Turn ${turnDir} at the end of the road${roadText}`;
      return `Turn at the end of the road${roadText}`;
    default:
      if (road) return `Continue on ${road}`;
      return `Continue along the road`;
  }
}

function getOrdinal(n) {
  let s = ["th", "st", "nd", "rd"];
  let v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function updateDirections(legs) {
  let list = document.getElementById('steps-list');
  list.innerHTML = "";

  legs.forEach(leg => {
    leg.steps.forEach(step => {
      let li = document.createElement('li');
      let dist = Math.round(step.distance);
      let instruction = buildEnglishInstruction(step);

      li.innerText = `${instruction} (${dist} m)`;
      list.appendChild(li);
    });
  });
}

document.getElementById('clear-btn').addEventListener('click', function () {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  if (routeLine) map.removeLayer(routeLine);

  document.getElementById('distance').innerText = "0.00 km";
  document.getElementById('time').innerText = "1 min";
  document.getElementById('steps-list').innerHTML = "";
});

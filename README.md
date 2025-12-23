# Mugla Real-Time Navigation System

This project is a web-based navigation application designed to calculate real-world driving routes between dynamically selected points on a map. It utilizes OpenStreetMap data and the OSRM (Open Source Routing Machine) service to provide accurate distances, estimated travel times, and turn-by-turn directions.

## Features

* **Dynamic Node Selection:** Users can click anywhere on the map to create starting points, intermediate stops, and destinations.
* **Real-World Routing:** Calculates paths based on actual road networks (driving mode), accounting for one-way streets and highway restrictions.
* **Multi-Stop Support:** Supports creating routes with multiple stops (e.g., A -> B -> C -> D).
* **Trip Statistics:** Automatically calculates and displays total distance (km) and estimated driving time (min).
* **Turn-by-Turn Directions:** Provides a detailed list of steps (directions) for the entire route in the sidebar.
* **Interactive Interface:** Clean, responsive user interface with a draggable map and a collapsible sidebar.

## Technologies Used

* **HTML5 & CSS3:** For structure and styling.
* **JavaScript (ES6):** For application logic.
* **Leaflet.js:** An open-source JavaScript library for interactive maps.
* **Leaflet Routing Machine:** A plugin to integrate OSRM routing into Leaflet.
* **OSRM (Open Source Routing Machine):** The backend service used for calculating shortest paths on real road networks.

## File Structure

* `index.html`: The main entry point of the application. Contains the map container and sidebar layout.
* `script.js`: Handles map initialization, click events, OSRM integration, and UI updates (stats and steps).
* `style.css`: Contains all styling for the map, sidebar, and control buttons.
* `dijkstra.js`: Contains the core Dijkstra algorithm implementation class (included for algorithmic reference).
* `graph-data.json`: A JSON template for graph data structures.

## Installation and Usage

1.  **Download:** Clone or download the project files into a local directory.
2.  **Open:** Open the `index.html` file in a modern web browser (Chrome, Firefox, Edge).
    * *Note:* For the best experience, it is recommended to use a local server (e.g., VS Code Live Server extension) to avoid CORS issues, although the project is designed to work directly.
3.  **Navigate:**
    * **Step 1:** Click on the map to set the **Start Point**.
    * **Step 2:** Click on other locations to add **Intermediate Stops**.
    * **Step 3:** Click on the final location to set the **Destination**.
4.  **View Results:** The application will draw the route, and the sidebar will display the total distance, time, and step-by-step directions.
5.  **Reset:** Click the "Clear Route" button to remove the current path and start over.

## Algorithm Overview

While the application utilizes the OSRM API for real-time global data, the underlying logic is based on shortest-path graph algorithms. The project includes a `dijkstra.js` file which demonstrates the foundational logic of weighted graph traversal used in navigation systems.
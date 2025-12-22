# Smart Route Navigator: Muğla District Path Finder 🗺️

An interactive web-based map application designed to find the shortest path between districts in Muğla, Turkey. This project implements graph search algorithms to solve routing problems on a real-world map interface.

## 🚀 Features
* **Interactive Map:** Select start and destination points using district markers.
* **Dijkstra's Algorithm:** Baseline implementation for finding the optimal shortest path.
* **A* (A-Star) Search:** Advanced search algorithm using heuristics for better performance.
* **Dynamic Graph Editing:** Users can add new locations by clicking on the map; new points are automatically connected to the nearest existing nodes.
* **Real-time Statistics:** Displays route steps, total distance (km), estimated travel time, and visited node counts for performance comparison.

## 🛠️ Tools & Libraries
* **Frontend:** HTML5, CSS3, JavaScript.
* **Map Library:** Leaflet.js.
* **Data Format:** External JSON (`graph-data.json`) for node and edge definitions.

## 📂 Project Structure
According to the project guidelines:
smart-route-finder/ ├── index.html # Main interface and library links ├── style.css # Styling for the map and UI components ├── graph-data.json # Nodes (districts), coordinates, and weighted edges ├── dijkstra.js # Algorithm implementations (Dijkstra and A*) ├── script.js # Map logic, event handling, and JSON fetching └── README.md # Project documentation


## ⚙️ Setup & Installation
1. Clone the repository or download the source files.
2. Open the folder in **Visual Studio Code**.
3. Ensure you have the **"Live Server"** extension installed.
4. Right-click `index.html` and select **"Open with Live Server"**.
    * *Note: Using a local server is required to fetch the `graph-data.json` file due to browser security policies.*

## 🔍 How It Works
1. **Selection:** Click a district marker to set the **Start Point**. Click another to set the **Destination**.
2. **Algorithm Selection:** Use the dropdown to choose between **Dijkstra** or **A***.
3. **Visualization:** The shortest path is drawn as a blue polyline.
4. **Edit Mode:** Click "Add New Location" to place a custom point on the map.

## 📊 Performance Comparison
In tests between **Milas** and **Menteşe**:
* **Dijkstra:** Finds the shortest path but explores nodes in all directions (Blind Search).
* **A*:** Guided by a heuristic (crow-flight distance), it visits fewer nodes to find the same optimal path, demonstrating better efficiency.

## 👨‍💻 Author
**Yeşim Yılmaz**
* **Course:** CENG 3511: Artificial Intelligence
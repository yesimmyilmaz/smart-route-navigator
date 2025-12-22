class PriorityQueue {
    constructor() { this.items = []; }
    enqueue(element, priority) {
        let qElement = { element, priority };
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) { this.items.splice(i, 0, qElement); added = true; break; }
        }
        if (!added) this.items.push(qElement);
    }
    dequeue() { return this.items.shift(); }
    isEmpty() { return this.items.length === 0; }
}

function heuristic(nodeA, nodeB) {
    const [lat1, lon1] = graphData.coordinates[nodeA];
    const [lat2, lon2] = graphData.coordinates[nodeB];
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function runPathfinding(start, end, isAStar) {
    let distances = {}, fScores = {}, previous = {}, visitedCount = 0;
    let pq = new PriorityQueue();
    graphData.nodes.forEach(node => { distances[node] = Infinity; fScores[node] = Infinity; previous[node] = null; });
    distances[start] = 0;
    fScores[start] = isAStar ? heuristic(start, end) : 0;
    pq.enqueue(start, fScores[start]);

    while (!pq.isEmpty()) {
        let current = pq.dequeue().element;
        visitedCount++;
        if (current === end) {
            let path = [], temp = end;
            while (temp) { path.push(temp); temp = previous[temp]; }
            return { path: path.reverse(), distance: Math.round(distances[end]), visitedCount };
        }
        if (graphData.edges[current]) {
            graphData.edges[current].forEach(neighbor => {
                let tempG = distances[current] + neighbor.weight;
                if (tempG < distances[neighbor.node]) {
                    distances[neighbor.node] = tempG;
                    previous[neighbor.node] = current;
                    let priority = isAStar ? (tempG + heuristic(neighbor.node, end)) : tempG;
                    pq.enqueue(neighbor.node, priority);
                }
            });
        }
    }
    return null;
}
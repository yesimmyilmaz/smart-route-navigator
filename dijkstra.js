class DijkstraCalculator {
    constructor() {
        this.nodes = [];
        this.edges = {};
    }

    addNode(node) {
        this.nodes.push(node);
        this.edges[node] = {};
    }

    addEdge(node1, node2, weight) {
        this.edges[node1][node2] = weight;
        this.edges[node2][node1] = weight;
    }

    shortestPath(startNode, endNode) {
        let distances = {};
        let backtrace = {};
        let pq = new PriorityQueue();

        distances[startNode] = 0;

        this.nodes.forEach(node => {
            if (node !== startNode) distances[node] = Infinity;
        });

        pq.enqueue([startNode, 0]);

        while (!pq.isEmpty()) {
            let shortestStep = pq.dequeue();
            let currentNode = shortestStep[0];

            this.nodes.forEach(neighbor => {
                let distance = distances[currentNode] + (this.edges[currentNode][neighbor] || Infinity);
                if (distance < distances[neighbor]) {
                    distances[neighbor] = distance;
                    backtrace[neighbor] = currentNode;
                    pq.enqueue([neighbor, distance]);
                }
            });
        }

        let path = [endNode];
        let lastStep = endNode;

        while (lastStep !== startNode) {
            path.unshift(backtrace[lastStep]);
            lastStep = backtrace[lastStep];
        }

        return `Path is ${path} and distance is ${distances[endNode]}`;
    }
}

class PriorityQueue {
    constructor() {
        this.collection = [];
    }

    enqueue(element) {
        if (this.isEmpty()) {
            this.collection.push(element);
        } else {
            let added = false;
            for (let i = 1; i <= this.collection.length; i++) {
                if (element[1] < this.collection[i - 1][1]) {
                    this.collection.splice(i - 1, 0, element);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.collection.push(element);
            }
        }
    }

    dequeue() {
        return this.collection.shift();
    }

    isEmpty() {
        return (this.collection.length === 0);
    }
}
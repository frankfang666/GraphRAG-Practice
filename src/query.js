
const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:3002/api/graph/query');
        const data = await response.json();
        const colors = ['blue', 'green', 'orange', 'pink'];
        
        // Transform the data to match the format expected by CytoscapeComponent
        let nodes = [], edges = [];
        const nodeIds = new Set();

        data.forEach(element => {
            const nodeId1 = element.m.properties.id, nodeId2 = element.n.properties.id;
            if (!nodeIds.has(nodeId1)) {
                nodes.push({data: {id: nodeId1, label: element.m.properties.name, color: colors[element.m.properties.level]}});
                nodeIds.add(nodeId1);
            }
            if (!nodeIds.has(nodeId2)) {
                nodes.push({data: {id: nodeId2, label: element.n.properties.name, color: colors[element.n.properties.level]}});
                nodeIds.add(nodeId2);
            }
        });

        data.forEach(element => {
            const sourceId = element.n.properties.id;
            const targetId = element.m.properties.id;
            if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
                edges.push({data: {source: sourceId, target: targetId, label: 'relates'}});
            }
        });
        return [...nodes, ...edges];
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export default fetchData;
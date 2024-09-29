import React, { useEffect, useRef, useMemo } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const MyGraph = ({ elements, setModalInfo, width, marginRight, setMarginRight, marginBottom, setMarginBottom, highlightedNodes }) => {
  const cyRef = useRef(null);

  // Define the layout of the graph using useMemo
  const layout = useMemo(() => ({
    name: "cose",
    fit: true,
    padding: 50,
    nodeRepulsion: 4000,
    idealEdgeLength: 100,
    edgeElasticity: 100,
    gravity: 0.25,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  }), []);

  // Define styles for nodes and edges
  const stylesheet = [
    {
      selector: 'node',
      style: {
        label: 'data(id)',
        width: 50,
        height: 50,
        backgroundColor: 'data(color)',
        color: '#fff',
        textHalign: 'center',
        textValign: 'center',
        fontSize: 12,
      },
    },
    {
      selector: 'edge',
      style: {
        width: 4,
        lineColor: '#ddd',
        targetArrowColor: '#ddd',
        targetArrowShape: 'triangle',
        curveStyle: 'bezier',
      },
    },
    {
      selector: '.highlight', // Add this new class for highlighting
      style: {
        'background-color': 'yellow',
        // 'line-color': '#61bffc',
        // 'target-arrow-color': '#61bffc',
        // 'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',
        'width': 70, // Increase node size
        'height': 70,
        'border-width': 5, // Add border
        'border-color': '#ff0000',
        'opacity': 0.8 // Change opacity
      }
    }
  ];

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.on('tap', 'node', (event) => {
        const node = event.target;
        setModalInfo({
          id: node.id(),
          label: node.data('label'),
          content: node.data('content')
        });
        setMarginBottom(15);
      });
    }
  }, [setModalInfo, setMarginBottom]);

  useEffect(() => {

    // Remove highlight from previously highlighted nodes
    cyRef.current.$('.highlight').removeClass('highlight');

    // Add highlight to the new set of highlighted nodes
    highlightedNodes.forEach(highlightedNode => {
      const nid = highlightedNode.id;
      cyRef.current.elements(`node[id = "${nid}"]`).addClass('highlight');

    });
  }, [highlightedNodes]);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.layout(layout).run();
    }
  }, [elements, layout]);

  return (
    <CytoscapeComponent
      cy={(cy) => { cyRef.current = cy; }}
      elements={elements}
      layout={layout}
      style={{ 
        width: `${width}%`, 
        height: `${90 - marginBottom - 10}%`, 
        border: '1px solid lightgray', 
        borderRadius: '10px', 
        marginTop: '0%', 
        marginRight: `${marginRight}%`, 
        marginBottom: `${marginBottom}%` 
      }}
      stylesheet={stylesheet}
    />
  );
};

export default MyGraph;
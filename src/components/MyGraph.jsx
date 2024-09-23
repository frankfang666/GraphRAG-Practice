import React, { useEffect, useRef, useMemo } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const MyGraph = ({ elements, setModalInfo, marginRight, setMarginRight }) => {
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
        setMarginRight(0);
      });
    }
  }, [setModalInfo, setMarginRight]);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.layout(layout).run();
    }
  }, [elements, layout]);

  useEffect(() => {
    console.log('Elements passed to MyGraph:', elements);
  }, [elements]);

  return (
    <CytoscapeComponent
      cy={(cy) => { cyRef.current = cy; }}
      elements={elements}
      layout={layout}
      style={{ width: '55%', height: '90%', border: '1px solid lightgray', borderRadius: '10px', marginRight: `${marginRight}%` }}
      stylesheet={stylesheet}
    />
  );
};

export default MyGraph;
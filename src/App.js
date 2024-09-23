import React, { useState } from 'react';
import MyGraph from './components/MyGraph';
import MyMenu from './components/MyMenu';
import ModalCard from './components/ModalCard';
import SearchArea from './components/search/SearchArea';

const App = () => {
  const [elements, setElements] = useState([]);
  const [originalElements, setOriginalElements] = useState([]); // New state for original elements
  const [showGraph, setShowGraph] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [marginRight, setMarginRight] = useState(0);
  const [marginBottom, setMarginBottom] = useState(0);
  const [search, setSearch] = useState(false);

  const middleWidth = 55;

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/graph/query');
      const data = await response.json();
      const colors = ['blue', 'green', 'orange', 'pink'];
      
      let nodes = [], edges = [];
      const nodeIds = new Set();

      data.forEach(element => {
        const nodeId1 = element.m.properties.id, nodeId2 = element.n.properties.id;
        if (!nodeIds.has(nodeId1)) {
          nodes.push({ group: 'nodes', 
                       data: { 
                                id: nodeId1, 
                                label: element.m.properties.name, 
                                color: colors[element.m.properties.level], 
                                content: element.m.properties.content, 
                                level: element.m.properties.level 
                              }
                      });
          nodeIds.add(nodeId1);
        }
        if (!nodeIds.has(nodeId2)) {
          nodes.push({ group: 'nodes', 
                       data: { 
                                id: nodeId2, 
                                label: element.n.properties.name, 
                                color: colors[element.n.properties.level], 
                                content: element.n.properties.content, 
                                level: element.n.properties.level 
                              }
                      });
          nodeIds.add(nodeId2);
        }
      });
      data.forEach(element => {
        const sourceId = element.n.properties.id;
        const targetId = element.m.properties.id;
        if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
          edges.push({ group: 'edges', data: { source: sourceId, target: targetId, label: 'relates' }});
        }
      });

      setElements([...nodes, ...edges]);
      setOriginalElements([...nodes, ...edges]); // Update original elements
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleButtonClick = () => {
    fetchData();
    setShowGraph(true);
  };
  
  const handleSearchButton = () => {
    setSearch(!search);
    setMarginRight(0);
  };

  const closeModal = () => {
    setMarginBottom(0);
    setModalInfo(null);
  };

  return (
    <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100vh' 
                }}
    >
      <div style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh', 
                    width: '100%' 
                  }}
      >
        <div style={{ position: 'absolute', left: 0, top: '5%', width: '15%', height: '400px' }}>
          <MyMenu originalElements={originalElements} setElements={setElements} search={search} handleButtonClick={handleButtonClick} handleSearchButton={handleSearchButton} /> {/* Pass originalElements to MyMenu */}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
          {showGraph ? 
              <MyGraph elements={elements}
                      setModalInfo={setModalInfo}
                      width={middleWidth}
                      marginRight={marginRight} 
                      setMarginRight={setMarginRight}
                      marginBottom={marginBottom}
                      setMarginBottom={setMarginBottom}/> : 
                      <div style={{ 
                            width: `${middleWidth}%`, 
                            height: '90%', 
                            border: '1px solid lightgray', 
                            borderRadius: '10px', 
                            marginRight: marginRight  }}
                      />
          }
          <ModalCard modalInfo={modalInfo} closeModal={closeModal} width={`${middleWidth}%`} /> {/* 使用新的 ModalCard 组件 */}
        </div>
        { search ? 
          <SearchArea model={'qwen2:7b'}/> : null
        } 
      </div>
    </div>
  );
};

export default App;
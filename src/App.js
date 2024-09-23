import React, { useState } from 'react';
import MyGraph from './components/MyGraph';
import MyMenu from './components/MyMenu';
import ModalCard from './components/ModalCard';
import InputArea from './components/InputArea'; // 引入新的 MyDisplay 组件

const App = () => {
  const [elements, setElements] = useState([]);
  const [originalElements, setOriginalElements] = useState([]); // New state for original elements
  const [showGraph, setShowGraph] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [marginRight, setMarginRight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);

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
  };

  const closeModal = () => {
    setMarginRight(0);
    setModalInfo(null);
  };

  const handleSearch = (value) => {
    setLoading(true);
    // Simulate a network request
    setTimeout(() => {
      setLoading(false);
      console.log('Search value:', value);
    }, 2000);
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
        {showGraph ? 
            <MyGraph elements={elements}
                    setModalInfo={setModalInfo} 
                    marginRight={marginRight} 
                    setMarginRight={setMarginRight}/> : 
                    <div style={{ 
                          width: '55%', 
                          height: '90%', 
                          border: '1px solid lightgray', 
                          borderRadius: '10px', 
                          marginRight: marginRight  }}
                    />
        }
        <ModalCard modalInfo={modalInfo} closeModal={closeModal} /> {/* 使用新的 ModalCard 组件 */}
      </div>
      { search ? 
        <InputArea 
          handleButtonClick={handleButtonClick} 
          handleSearch={handleSearch} 
          loading={loading}
          style={{ width: '200%' }} 
        /> : null
      } 
    </div>
  );
};

export default App;
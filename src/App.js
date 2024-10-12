import React, { useState } from 'react';
import MyGraph from './components/display/MyGraph';
import ModalCard from './components/display/ModalCard';
import SearchArea from './components/search/SearchArea';
import './App.css'; // Import the CSS file
import MyContext from './MyContext';
import VerticalMenu from './components/menu/VerticalMenu';
import CollapseButton from './components/menu/CollapseButton'; // Import CollapseButton
import NodeList from './components/display/NodeList';
import { notification } from 'antd';

const App = () => {
  const [elements, setElements] = useState([]);
  const [originalElements, setOriginalElements] = useState([]); // New state for original elements
  const [showGraph, setShowGraph] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [marginRight, setMarginRight] = useState(0);
  const [marginBottom, setMarginBottom] = useState(0);
  const [search, setSearch] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]); // Add selectedKeys state
  const [collapsed, setCollapsed] = useState(false); // Add collapsed state
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [showNodeList, setShowNodeList] = useState(false);
  const [nodeSearchInput, setNodeSearchInput] = useState('');
  const middleWidth = 55;

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/get_graph', {
        mode: 'cors',
        method: 'GET',
      });
      const data = await response.json();
      const colors = ['blue', 'green', 'orange', 'pink'];
      
      let nodes = [], edges = [];
      const nodeIds = new Set();

      data['response'].forEach(element => {
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
      data['response'].forEach(element => {
        const sourceId = element.n.properties.id;
        const targetId = element.m.properties.id;
        if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
          edges.push({ group: 'edges', data: { source: sourceId, target: targetId, label: 'relates' }});
        }
      });

      setElements([...nodes, ...edges]);
      setOriginalElements([...nodes, ...edges]); // Update original elements
    } catch (error) {
      notification.error({
        message: '获取数据失败',
        description: '请检查服务器是否正常运行',
      });
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

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <MyContext.Provider value={{ search, setSearch, setSelectedKeys }}>
      <div className="app-container">
        <div className="inner-container">
          <div className="menu-container" style={{ width: collapsed ? 0 : 80 }}>
            { collapsed ? null : <VerticalMenu originalElements={originalElements} 
                          setElements={setElements} 
                          search={search} 
                          setSearch={setSearch}
                          handleButtonClick={handleButtonClick} 
                          handleSearchButton={handleSearchButton} 
                          selectedKeys={selectedKeys} 
                          setSelectedKeys={setSelectedKeys} 
                          showGraph={showGraph} 
                          setHighlightedNodes={setHighlightedNodes}
                          setShowNodeList={setShowNodeList}
                          nodeSearchInput={nodeSearchInput}
                          setNodeSearchInput={setNodeSearchInput}
                          />}
            <CollapseButton collapsed={collapsed} onToggle={handleToggleCollapse} />
          </div>
          <div className="graph-container">
            {showGraph ? 
                <MyGraph elements={elements}
                        setModalInfo={setModalInfo}
                        width={middleWidth}
                        marginRight={marginRight} 
                        setMarginRight={setMarginRight}
                        marginBottom={marginBottom}
                        setMarginBottom={setMarginBottom}
                        highlightedNodes={highlightedNodes}/> : 
                        <div className="graph-placeholder" style={{ width: `${middleWidth}%`, height: `${90 - marginBottom - 10}%` }} />
            }
            <ModalCard modalInfo={modalInfo} closeModal={closeModal} width={`${middleWidth}%`} /> {/* 使用新的 ModalCard 组件 */}
          </div>
          { (search && !showNodeList) ? 
            <SearchArea model={'qwen2:7b'}/> : 
            (!search && showNodeList) ? 
            <NodeList highlightedNodes={highlightedNodes} 
                      setHighlightedNodes={setHighlightedNodes} 
                      setNodeSearchInput={setNodeSearchInput} 
                      setShowNodeList={setShowNodeList} /> : null
          } 
        </div>
      </div>
    </MyContext.Provider>
  );
};

export default App;
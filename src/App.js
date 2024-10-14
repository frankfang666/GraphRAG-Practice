import React, { useState } from 'react';
import MyGraph from './components/display/MyGraph';
import ModalCard from './components/display/ModalCard';
import SearchArea from './components/search/SearchArea';
import './App.css'; // Import the CSS file
import MyContext from './MyContext';
import VerticalMenu from './components/menu/VerticalMenu';
import CollapseButton from './components/menu/CollapseButton'; // Import CollapseButton
import NodeList from './components/display/NodeList';
import { notification, Popover, Button, Divider } from 'antd';

const App = () => {
  const [elements, setElements] = useState([]);
  const [originalElements, setOriginalElements] = useState([]); // New state for original elements
  const [showGraph, setShowGraph] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [search, setSearch] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]); // Add selectedKeys state
  const [collapsed, setCollapsed] = useState(false); // Add collapsed state
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [showNodeList, setShowNodeList] = useState(false);
  const [nodeSearchInput, setNodeSearchInput] = useState('');
  const [database, setDatabase] = useState('test');
  const [limit, setLimit] = useState(10);
  const [file, setFile] = useState(null);
  const model = 'qwen2:7b';

  const fetchData = async (database, limit) => {
    try {
      const response = await fetch(`http://localhost:8000/get_graph?database=${database}&limit=${limit}`, {
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

  const handleButtonClick = (database, limit) => {
    fetchData(database, limit);
    setShowGraph(true);
  };
  
  const handleSearchButton = () => {
    setSearch(!search);
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const verticalMenuProps = {
    originalElements,
    setElements,
    search, setSearch,
    handleButtonClick,
    database, setDatabase,
    limit, setLimit,
    handleSearchButton,
    selectedKeys, setSelectedKeys,
    showGraph,
    setHighlightedNodes,
    setShowNodeList,
    nodeSearchInput, setNodeSearchInput,
    setFile,
  };

  const content = (
    <div>
      <p>{`当前连接数据库：${database}`}</p>
      <p>{`当前调用模型：${model}`}</p>
      <p>{`当前使用文件：${file ? file.name : '无'}`}</p>
    </div>
  );

  return (
    <MyContext.Provider value={{ search, setSearch, setSelectedKeys }}>
      <div className="app-container" style={{ position: 'relative' }}>
        <Popover content={content} style={{ position: 'absolute', top: 0, padding: '10px', zIndex: 1000 }}>
            <Button type="text">显示当前信息</Button>
        </Popover>
        <Divider style={{position: 'absolute', top: 10, width: '100%'}}/>
        <div className="inner-container">
          <div className="graph-container" style={{ position: 'relative' }}>
            {showGraph ? 
                <MyGraph elements={elements}
                        setModalInfo={setModalInfo}
                        highlightedNodes={highlightedNodes}
                    /> : 
                    null
            }
            <ModalCard modalInfo={modalInfo} closeModal={closeModal} width={'55%'} />
          </div>
          {collapsed ? 
              <div>
                <CollapseButton collapsed={collapsed} onToggle={handleToggleCollapse} /> 
              </div> : 
              <div className="vertical-menu-overlay"> 
                <VerticalMenu {...verticalMenuProps} />
                <CollapseButton collapsed={collapsed} onToggle={handleToggleCollapse} />
              </div>
          }
          <div className="overlay-container">
            <div className="overlay-content">
              { (search && !showNodeList) ? 
                <SearchArea model={model} style={{position: 'absolute', height: '100%'}}/> : 
                (!search && showNodeList) ? 
                <NodeList highlightedNodes={highlightedNodes} 
                          setHighlightedNodes={setHighlightedNodes} 
                          setNodeSearchInput={setNodeSearchInput} 
                          setShowNodeList={setShowNodeList} /> : null
              }
            </div>
          </div>
        </div>
      </div>
    </MyContext.Provider>
  );
};

export default App;

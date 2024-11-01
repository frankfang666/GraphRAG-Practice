import React, { useState } from 'react';
import MyGraph from '../components/display/MyGraph';
import ModalCard from '../components/display/ModalCard';
import SearchArea from '../components/search/SearchArea';
import './GraphPage.css'; // Import the CSS file
import MyContext from '../MyContext';
import VerticalMenu from '../components/menu/VerticalMenu';
import CollapseButton from '../components/menu/CollapseButton';
import NodeList from '../components/display/NodeList';
import { notification, Popover, Button, Divider, Tooltip, Card } from 'antd';
import { LoginOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';

const GraphPage = () => {
  const [elements, setElements] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [search, setSearch] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [showNodeList, setShowNodeList] = useState(false);
  const [nodeSearchInput, setNodeSearchInput] = useState('');
  const [database, setDatabase] = useState(null);
  const [limit, setLimit] = useState(10);
  const [files, setFiles] = useState([]);
  const [currProcessingFile, setCurrProcessingFile] = useState(null);
  const model = 'qwen2:7b';

  const fetchData = async (database, limit) => {
    try {
      const response = await fetch(`http://localhost:8000/get_graph/${database}?limit=${limit}`, {
        mode: 'cors',
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      
      let nodes = [], edges = [];
      const nodeIds = new Set();

      data['response'].forEach(element => {
        const nodeId1 = element.m.id, nodeId2 = element.n.id;
        if (!nodeIds.has(nodeId1)) {
          nodes.push({ group: 'nodes', 
                       data: { 
                                id: nodeId1, 
                                label: element.m.properties.id, 
                              }
                      });
          nodeIds.add(nodeId1);
        }
        if (!nodeIds.has(nodeId2)) {
          nodes.push({ group: 'nodes', 
                       data: { 
                                id: nodeId2, 
                                label: element.n.properties.id,
                              }
                      });
          nodeIds.add(nodeId2);
        }
      });
      data['response'].forEach(element => {
        const sourceId = element.n.id;
        const targetId = element.m.id;
        if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
          edges.push({ group: 'edges', data: { source: sourceId, target: targetId, label: element.r.relationshipType }});
        }
      });

      setElements([...nodes, ...edges]);
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
    files,setFiles,
    setCurrProcessingFile,
  };

  return (
    <MyContext.Provider value={{ search, setSearch, setSelectedKeys, database }}>
      <Tooltip title="退出登录">
        <Button
          icon={<LoginOutlined />}
          type="text"
          style={{ position: 'absolute', top: 0, left: 20, zIndex: 1000 }}
          onClick={() => {
            window.location.replace('/');
          }}
        />
      </Tooltip>
      <div className="app-container" style={{ position: 'relative' }}>
        <Popover content={<Card
            title="当前信息"
            bordered={false}
            style={{
              width: 200,
            }}
          >
            <p><b>数据库：</b>{database ? database : '无'}</p>
            <p><b>模型：</b>{model} </p>
            <p><b>图谱生成状态: </b>{currProcessingFile ? <p>{`正在生成 ${currProcessingFile.name} 的图谱`}<LoadingOutlined /></p> : <p>{'当前无任务'}</p>}</p>
          </Card>} style={{ position: 'absolute', top: 0, padding: '10px', zIndex: 1000 }}>
            <Button type="text">显示当前信息 <DownOutlined /></Button>
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
          <div className="overlay-container" style={{zIndex: (search || showNodeList) ? 20 : -10}}>
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

export default GraphPage;

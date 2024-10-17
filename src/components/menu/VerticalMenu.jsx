import React, { useEffect, useState, useRef } from 'react';
import { Menu, Avatar, notification, Tooltip, Modal, Input, Select, message } from 'antd';
import {
  OrderedListOutlined,
  NodeIndexOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import '../styles/Menu.css'; // Import CSS for additional styling

const { Option } = Select; // Destructure Option from Select

const VerticalMenu = ({ 
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
  }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isGraphModalVisible, setIsGraphModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isSubModalVisible, setIsSubModalVisible] = useState(false);
  const [dblist, setDbList] = useState([]);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const fileInputRef = useRef(null); // Create a ref for the file input element

  useEffect(() => {
    const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/list_databases', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setDbList(data['databases']);
    } catch (error) {
      console.error('Error fetching data:', error);
      }
    };
    fetchData();  
  }, []);

  useEffect(() => {
    const levels = new Set();
    originalElements.forEach(element => {
      if (element.data && element.data.level !== undefined) {
        levels.add(element.data.level);
      }
    });

    const items = Array.from(levels).sort().map(level => ({
      key: `level-${level}`,
      label: `第${level}层`,
    }));

    setMenuItems(items);
  }, [originalElements]);

  const onClick = (e) => {
    console.log(selectedKeys);
    if (e.key === 'search') {
      setIsSearchModalVisible(true);
      return;
    }
  
    if (e.key === 'sub') {
      if (!showGraph) {
        notification.warning({
          message: '提示',
          description: '请先点击显示图表按钮',
        });
        return;
      }
      setIsSubModalVisible(true);
      return;
    }
  
    setSelectedKeys([e.key]); // 设置高亮

    if (e.key === 'show-graph') {
      setIsGraphModalVisible(true);
      return;
    }

    if (e.key === 'upload') {
      setSelectedKeys([]);
      fileInputRef.current.click(); // Use ref to trigger the file input dialog
      return;
    }
  };

  const handleOk = async () => {
    try {
      const response = await fetch('http://localhost:8000/search_nodes', {
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: nodeSearchInput }), // Send input value in the request body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHighlightedNodes(data['response']);
      setIsModalVisible(false);
      setShowNodeList(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the file upload logic here
      message.success(`${file.name}文件上传成功`);
      // Reset the input value to allow re-uploading the same file if needed
      event.target.value = null;
      setFile(file);
    }
  };

  const handleGraphModalOk = () => {
    // Handle the inputs here
    setDatabase(input1);
    setLimit(input2);
    console.log(database, limit);
    handleButtonClick(input1, input2);
    setIsGraphModalVisible(false);
  };

  const handleGraphModalCancel = () => {
    setSelectedKeys([]);
    setIsGraphModalVisible(false);
  };

  return (
    <>
      <Menu
        mode="vertical"
        theme="light"
        style={{ borderRadius: '15px'}}
        className="custom-menu"
        onClick={onClick}
        selectedKeys={selectedKeys} // 设置 selectedKeys
        items={[
          {
            key: 'avatar',
            label: <Avatar size="large" src="favicon.ico" />,
            className: 'avatar',
          },
          {
            key: 'show-graph',
            icon: (
              <Tooltip title="显示图谱">
                <NodeIndexOutlined  />
              </Tooltip>
            ),
          },
          {
            key: 'search',
            icon: (
              <Tooltip title="信息搜索">
                <SearchOutlined />
              </Tooltip>
            ),
            // Remove children and handle click to show modal
          },
          {
            key: 'sub',
            icon: (
              <Tooltip title="层级展示">
                <OrderedListOutlined />
              </Tooltip>
            ),
            // Remove children and handle click to show modal
          },
          {
            key: 'upload',
            icon: (
              <Tooltip title="上传文件">
                <UploadOutlined />
              </Tooltip>
            ),
          }
        ]}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }} // Hide the file input
        onChange={handleFileChange} // Handle file selection
      />
      <Modal title="节点搜索" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input value={nodeSearchInput} onChange={(e) => setNodeSearchInput(e.target.value)} placeholder="请输入搜索关键词" />
      </Modal>
      <Modal title="信息搜索" open={isSearchModalVisible} onOk={() => setIsSearchModalVisible(false)} onCancel={() => setIsSearchModalVisible(false)}>
        <Menu
          selectedKeys={selectedKeys}
          items={[
            {
              key: 'ragsearch',
              label: 'RAG检索',
              onClick: () => {
                setIsSearchModalVisible(false);
                if (search) {
                  setSelectedKeys([]); // 仅取消当前的key
                  setSearch(false);
                } else {
                  setSelectedKeys(['ragsearch']); 
                  setSearch(true);
                }
                handleSearchButton();
                setShowNodeList(false);
                return;
              },
            },
            {
              key: 'nodesearch',
              label: '节点搜索',
              onClick: () => {
                setIsSearchModalVisible(false);
                console.log(showGraph);
                if (!showGraph) {
                  notification.warning({
                    message: '提示',
                    description: '请先点击显示图表按钮',
                  });
                  return;
                }
                setSearch(false);
                setSelectedKeys([]); // 仅取消当前的key
                setIsModalVisible(true); // Show the modal
                return;
              },
            },
          ]}
        />
      </Modal>
      <Modal title="层级展示" open={isSubModalVisible} onOk={() => setIsSubModalVisible(false)} onCancel={() => setIsSubModalVisible(false)}>
        <Menu
          items={menuItems.map(item => ({
            ...item,
            onClick: (e) => {
              setIsSubModalVisible(false);
              const level = parseInt(e.key.split('-')[1], 10);
    
              // Filter nodes based on the selected level
              const filteredNodes = originalElements.filter(element => {
                return element.group === 'nodes' && (element.data.level === undefined || element.data.level >= level);
              });

              const nodeIds = new Set(filteredNodes.map(node => node.data.id));
              
              // Filter edges that connect the filtered nodes
              const filteredEdges = originalElements.filter(element => {
                return element.group === 'edges' && nodeIds.has(element.data.source) && nodeIds.has(element.data.target);
              });

              setElements([...filteredNodes, ...filteredEdges]);
            },
          }))}
        />
      </Modal>
      <Modal
        title="显示图谱"
        open={isGraphModalVisible}
        onOk={handleGraphModalOk}
        onCancel={handleGraphModalCancel}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ marginRight: '10px', minWidth: '100px' }}>数据库名:</span>
          <Select
            placeholder="选择数据库名"
            onChange={(value) => setInput1(value)}
            style={{ flex: 1 }}
          >
            {dblist.map((db) => (
              <Option key={db} value={db}>{db}</Option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px', minWidth: '100px' }}>关系数量:</span>
          <Input
            placeholder="输入获取的关系数量"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      </Modal>
    </>
  );
};

export default VerticalMenu;

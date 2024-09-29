import React, { useEffect, useState } from 'react';
import { Menu, Avatar, notification, Tooltip, Modal, Input } from 'antd';
import {
  OrderedListOutlined,
  NodeIndexOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import '../styles/Menu.css'; // Import CSS for additional styling

const VerticalMenu = ({ 
    originalElements, 
    setElements, 
    handleButtonClick, 
    search, 
    setSearch, 
    handleSearchButton, 
    setSelectedKeys, 
    selectedKeys, 
    showGraph, 
    setHighlightedNodes, 
    setShowNodeList, 
    nodeSearchInput, 
    setNodeSearchInput 
  }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    if (e.key === 'ragsearch') {
      if (search) {
        setSelectedKeys([]); // 仅取消当前的key
        setSearch(false);
      } else {
        setSelectedKeys([e.key]); 
        setSearch(true);
      }
      handleSearchButton();
      setShowNodeList(false);
      return;
    }

    if (e.key === 'nodesearch') {
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
    }

    setSelectedKeys([e.key]); // 设置高亮

    if (e.key === 'show-graph') {
      handleButtonClick();
      return;
    }

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

  return (
    <>
      <Menu
        mode="vertical"
        theme="light"
        style={{ width: 80, height: '70%', borderRadius: '15px', padding: '10px 0' }}
        className="custom-menu"
        onClick={onClick}
        selectedKeys={selectedKeys} // 设置 selectedKeys
        items={[
          {
            key: '4',
            label: <Avatar size="large" src="favicon.ico" />,
            className: 'avatar',
          },
          {
            key: 'show-graph',
            icon: (
              <Tooltip title="显示图谱">
                <NodeIndexOutlined />
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
            children: [
              {
                key: 'ragsearch',
                label: 'RAG检索',
              },
              {
                key: 'nodesearch',
                label: '节点搜索',
              }
            ],
          },
          {
            key: 'sub',
            icon: (
              <Tooltip title="层级展示">
                <OrderedListOutlined />
              </Tooltip>
            ),
            onTitleClick: () => {
              if (!showGraph) {
                notification.warning({
                  message: '提示',
                  description: '请先点击显示图表按钮',
                });
              }
            },
            children: menuItems,
          },
        ]}
      />
      <Modal title="节点搜索" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input value={nodeSearchInput} onChange={(e) => setNodeSearchInput(e.target.value)} placeholder="请输入搜索关键词" />
      </Modal>
    </>
  );
};

export default VerticalMenu;
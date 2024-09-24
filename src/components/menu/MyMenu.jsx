import React, { useEffect, useState } from 'react';
import { OrderedListOutlined, NodeIndexOutlined, SearchOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const MyMenu = ({ originalElements, setElements, handleButtonClick, search, handleSearchButton, setSelectedKeys, selectedKeys }) => {
  const [menuItems, setMenuItems] = useState([]);

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
    if (e.key === 'search') {
      if (search) {
        setSelectedKeys([]);
      }
      else setSelectedKeys([e.key]); // 取消高亮
      handleSearchButton();
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

  return (
    <Menu
      onClick={onClick}
      style={{ width: '100%' }}
      mode="inline"
      selectedKeys={selectedKeys} // 设置 selectedKeys
      items={[
        {
          key: 'show-graph',
          label: '显示图谱',
          icon: <NodeIndexOutlined />,
        },
        {
            key: 'search',
            label: '搜索',
            icon: <SearchOutlined />,
        },
        {
          key: 'sub',
          label: '层级选择',
          icon: <OrderedListOutlined />,
          children: menuItems,
        },
      ]}
    />
  );
};

export default MyMenu;
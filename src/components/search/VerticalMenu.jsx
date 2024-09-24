import React, { useEffect, useState } from 'react';
import { Menu, Avatar, notification, Tooltip } from 'antd';
import {
  OrderedListOutlined,
  NodeIndexOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import '../styles/Menu.css'; // Import CSS for additional styling

const VerticalMenu = ({ originalElements, setElements, handleButtonClick, search, handleSearchButton, setSelectedKeys, selectedKeys, showGraph }) => {
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
      } else {
        setSelectedKeys([e.key]); // 取消高亮
      }
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
            <Tooltip title="搜索">
              <SearchOutlined />
            </Tooltip>
          ),
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
  );
};

export default VerticalMenu;
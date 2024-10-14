import React from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import '../styles/CollapseButton.css'; // Import CSS for additional styling

const CollapseButton = ({ collapsed, onToggle }) => {
  return (
    <Button
      type="text"
      icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
      onClick={onToggle}
      style={{left: collapsed ? '0px' : '60px', top: collapsed ? '44%' : '50%'}}
      className="collapse-button"
    />
  );
};

export default CollapseButton;

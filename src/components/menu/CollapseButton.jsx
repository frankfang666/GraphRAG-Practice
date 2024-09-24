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
      className="collapse-button"
    />
  );
};

export default CollapseButton;

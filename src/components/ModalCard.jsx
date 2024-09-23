import React from 'react';
import { Card, Button as AntdButton } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export default function ModalCard({ modalInfo, closeModal }) {
  return (
    modalInfo && (
      <Card
        title="节点信息"
        extra={<AntdButton onClick={closeModal} icon={<CloseOutlined />} style={{ backgroundColor: '#87CEEB', color: 'white', border: 'none', marginRight: '-15px' }} />}
        headStyle={{ backgroundColor: '#87CEEB', color: 'white' }}
        style={{ 
                position: 'absolute', 
                height: '75%', 
                width: "20%", 
                overflowY: 'auto', 
                marginLeft: '78%', 
                backgroundColor: '#f0f0f0', 
                border: '1px solid lightgray' 
              }}
      >
        <p>{modalInfo.label}</p>
        <p>{modalInfo.content}</p>
      </Card>
    )
  );
};

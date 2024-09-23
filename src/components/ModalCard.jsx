import React from 'react';
import { Card, Button as AntdButton } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export default function ModalCard({ modalInfo, closeModal, width }) {
  return (
    modalInfo && (
      <Card
        title="节点信息"
        extra={<AntdButton onClick={closeModal} icon={<CloseOutlined />} style={{ backgroundColor: '#87CEEB', color: 'white', border: 'none', marginRight: '-15px' }} />}
        headStyle={{ backgroundColor: '#87CEEB', color: 'white' }}
        style={{ 
                position: 'absolute', 
                height: '27%', 
                width: width, 
                overflowY: 'auto', 
                marginTop: '39%', 
                marginLeft: '0%', 
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

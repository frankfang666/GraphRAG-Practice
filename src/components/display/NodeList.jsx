import React, { useState } from 'react';
import { List, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const NodeList = ({highlightedNodes, setHighlightedNodes, setNodeSearchInput, setShowNodeList}) => {
  const [visible, setVisible] = useState(true);

  const data = highlightedNodes.map(node => ({
    title: node.id,
    description: node.content || node.name
  }));

  return (
    visible && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '25%' }}>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => { setVisible(false); setHighlightedNodes([]); setNodeSearchInput(''); setShowNodeList(false); } }
              style={{ alignSelf: 'flex-end', marginBottom: '10px', marginRight: '10px' }} />
              <div style={{ width: '100%', height: '100%', position: 'relative', marginRight: '10px' , overflowY: 'auto'}}>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={`章节：${item.title}`}
                                description={item.description} />
                        </List.Item>
                    )} />
              </div>
        </div>
    )
  );
};

export default NodeList;
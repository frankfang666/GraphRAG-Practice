import React from 'react';
import { Input } from 'antd';
import Uploader from './Uploader';

const { Search } = Input;

const InputArea = ({ handleSearch, loading }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginTop: '20px', marginBottom: '3%', width: '55%' }}>
      <Search 
        placeholder="请输入你的问题" 
        loading={loading} 
        enterButton="搜索"
        onSearch={handleSearch} 
        style={{ width: '100%' }} // 设置输入框宽度
      />
      <Uploader />
    </div>
  );
};

export default InputArea;
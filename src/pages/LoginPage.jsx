// src/components/LoginPage.js
import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import './LoginPage.css'; // 引入样式文件

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 使用 useNavigate 钩子

  const onFinish = (values) => {
    setLoading(true);
    setError(null);

    // Simulate a login request
    setTimeout(() => {
      setLoading(false);
      if (values.username === 'admin' && values.password === 'ffffff') {
        navigate('/graph'); // 登录成功后跳转到 GraphPage
      } else {
        setError('用户名或密码错误');
      }
    }, 1000);
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <h2>欢迎回来</h2>
        {error && <Alert message={error} type="error" showIcon />}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入您的用户名!' }]}
          >
            <Input placeholder="用户名" prefix={<UserOutlined />}/>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入您的密码!' }]}
          >
            <Input.Password placeholder="密码" prefix={<LockOutlined />}/>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="additional-info">
          <p>还没有账号？<a href="/register">注册</a></p>
          <p>忘记密码？<a href="/reset">重置密码</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

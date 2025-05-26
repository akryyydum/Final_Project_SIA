import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import LoginImage from '../assets/login-at.jpg';

const { Title, Text } = Typography;

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async ({ email, password }) => {
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser({ email, password });
      if (res.data && res.data.token) {
        login(res.data.token);
        setLoading(false);
        navigate('/');
      } else {
        throw new Error('No token received');
      }
    } catch {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image-section">
        <img src={LoginImage} alt="Login Visual" className="login-image" />
      </div>

      <div className="login-form-section">
        <Card bordered={false} className="login-card">
          <Title level={2} className="login-title">Login</Title>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
              className="login-alert"
            />
          )}

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="login-form"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input size="large" placeholder="Email" autoComplete="email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password size="large" placeholder="Password" autoComplete="current-password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="login-button"
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <Text className="signup-text">
            Don't have an account?{' '}
            <a href="/signup" className="signup-link">Sign Up</a>
          </Text>
        </Card>
      </div>
    </div>
  );
};

export default Login;

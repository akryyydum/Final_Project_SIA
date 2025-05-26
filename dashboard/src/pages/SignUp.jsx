import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/userApi';
import SignupImage from '../assets/signup-at.jpg';
import './Login.css';

const { Title, Text } = Typography;
const { Option } = Select;

const SignUp = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setError('');
    setLoading(true);

    const { name, email, password, role } = values;

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      await registerUser({ name, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image-section">
        <img src={SignupImage} alt="Sign Up Illustration" className="login-image" />
      </div>
      <div className="login-form-section">
        <Title level={2} className="login-title">
          Sign Up
        </Title>

        {error && <Alert type="error" message={error} showIcon className="login-alert" />}

        <Form
          name="signup"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: 'customer' }}
          requiredMark={false}
          className="login-form"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Select size="large">
              <Option value="customer">Customer</Option>
              <Option value="admin">Admin</Option>
            </Select>
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
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Form.Item>

          <Text className="signup-text">
            Already have an account?{' '}
            <Link to="/login" className="signup-link">
              Login
            </Link>
          </Text>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;

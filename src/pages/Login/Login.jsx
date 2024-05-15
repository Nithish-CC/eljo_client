import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Image, Flex, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../../globals/interceptors';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false)
  const onFinish = (values) => {
    setLoading(true);
    api.post(`/api/v1/login`, values)
      .then(response => {
        localStorage.setItem("token", response?.data?.token);
        messageApi.open({
          type: 'success',
          content: 'login successfully !',
        });
        setTimeout(() => {
          setLoading(false);
          if (response?.data?.role === "admin") {
            navigate('/employees')
          } else if (response?.data?.role === "employee") {
            navigate('/profile')
          }
        }, 2000);
      })
      .catch(error => {
        setLoading(false);
        messageApi.open({
          type: 'error',
          content: 'login failed !!',
        });
        console.error('Error fetching employees:', error);
      });
  };

  useEffect(() => {
    localStorage.clear();
  }, [])


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      {contextHolder}
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <Flex justify={"cemter"} align={"center"} style={{ margin: "auto", justifyContent: 'center' }}>
          <Image src={"https://img.icons8.com/color/48/react-native.png"} preview={false} style={{ width: "100%", height: '100%' }} />
        </Flex>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ width: 300 }}
        >
          <h1 style={{ textAlign: 'center', marginBottom: 30 }}>Login</h1>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email address" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="login-form-button" style={{ width: '100%' }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

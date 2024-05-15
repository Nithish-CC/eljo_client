import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Drawer, Form, Modal, Card, Row, Col, Typography, Flex, Layout, Avatar, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import DepartmentFilter from '../../compnents/Department';
import EmployeeProfile from '../../compnents/EmployeeProfile';
import api from '../../globals/interceptors';
import { getPresignedURL } from '../../utils/s3';
const { Title } = Typography;
const { Content } = Layout;

const Employee = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const departmentId = Form.useWatch((values) => values.departmentId || "all", form);

  const [employees, setEmployees] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'profile_image',
      key: 'profile_image',
      render: (profile_image, record) => {
        if (profile_image !== '' && profile_image !== null && profile_image !== undefined) {
          return <Avatar size="large" src={<img src={profile_image} alt={record?.first_name} />} />
        } else {
          return <Avatar style={{ backgroundColor: 'dodgerblue' }} icon={<UserOutlined />} />
        }
      }
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      align: 'center'
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      align: 'center'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center'
    },
    {
      title: 'Employee code',
      dataIndex: 'employee_code',
      key: 'employee_code',
      align: 'center'
    },
    {
      title: 'Department',
      dataIndex: 'department_name',
      key: 'department_name',
      align: 'center'
    },
    {
      title: 'Contact Number',
      dataIndex: 'contact_number',
      key: 'contact_number',
      align: 'center'
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => showDrawer(record)} />
          <Button type="danger" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record)} />
        </Space>
      ),
    },
  ];


  const fetchEmployees = async () => {
    try {
      const response = await api.get(`/api/v1/employee?departmentId=${departmentId}`);
      if (response?.data?.success && response?.data?.message.length) {
        const employeesWithImages = await Promise.all(
          response.data.message.map(async (employee) => {
            const { profile_image } = employee;
            if (profile_image !== '' && profile_image !== null && profile_image !== undefined) {
              const result = await getPresignedURL(profile_image);
              if (result.success) {
                return { ...employee, profile_image: result.message };
              } else {
                return employee;
              }
            }
            return employee;
          })
        );
        setEmployees(employeesWithImages);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    if (departmentId !== undefined) {
      fetchEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId]);

  const showDrawer = (record) => {
    console.log(record)
    setVisible(true);
    setIsEdit(!!record);
    setFormData(record || {});
  };

  const onClose = () => {
    setVisible(false);
    setFormData({});
    fetchEmployees();
  };

  const showDeleteConfirm = (record) => {
    setDeleteRecord(record);
    setDeleteModalVisible(true);
  };


  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteRecord(null);
  };

  const handleDelete = () => {
    if (deleteRecord?.hasOwnProperty('id') && deleteRecord?.id > 0) {
      api.delete(`/api/v1/employee/${deleteRecord?.id}`)
        .then(response => {
          if (response?.data?.success) {
            handleCancelDelete();
            messageApi.open({
              type: 'success',
              content: 'Employee deleted successfully',
            });
            fetchEmployees();
          }
        })
        .catch(error => {
          messageApi.open({
            type: 'success',
            content: 'Failed to delete Employee',
          });
          fetchEmployees();
          console.error('Error fetching employees:', error);
        });
    }
    console.log('Deleting record:', deleteRecord);
    setDeleteModalVisible(false);
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  return (
    <div>
      {contextHolder}
      <Card size="small">
        <Row gutter={16} justify="space-between" align="middle">
          <Col className="gutter-row" md={4}>
            <Title level={5} style={{ marginTop: '8px' }}>Employee List</Title>
          </Col>
          <Col className="gutter-row" md={8}>
            <Flex gap={'large'}>
              <div style={{ width: '100%' }}>
                <Form
                  form={form}
                  name="department_form"
                  onFinish={onFinish}
                  autoComplete="off"
                  defaultValue={{ departmentId: "all" }}
                >
                  <DepartmentFilter />
                </Form>
              </div>
              <Button type="primary" onClick={() => showDrawer()} icon={<PlusOutlined />}>
                Add Employee
              </Button>
            </Flex>
          </Col>
        </Row>
      </Card>
      <Content style={{ padding: '0 48px', marginTop: '20px' }}>
        <Table columns={columns} dataSource={employees} rowKey="id" scroll={{ x: 'auto', y: 400 }} />
      </Content>

      <Drawer
        title={isEdit ? 'Edit Employee' : 'Add Employee'}
        width={"50%"}
        onClose={onClose}
        open={visible}
        destroyOnClose={true}
      >
        {visible && <EmployeeProfile  {...{ isEdit, formData, onClose }} />}
      </Drawer>

      <Modal
        title="Delete Employee"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this employee?</p>
      </Modal>
    </div>
  );
};

export default Employee;

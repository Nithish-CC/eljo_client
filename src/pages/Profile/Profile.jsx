import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Image, Flex, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DepartmentFilter from '../../compnents/Department';
import { deleteBucketImage, getPresignedURL, handleUpload } from '../../utils/s3';
import api from '../../globals/interceptors';

const Profile = ({ isEdit, formData, onClose }) => {
  console.log(formData)
  const [messageApi, contextHolder] = message.useMessage();
  const [profileData,setProfileData] = useState()
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('')
  const [form] = Form.useForm();
  const onFinish = (values) => {
    setConfirmLoading(true);
    const employeeApiCall = (values) => {
      console.log(values)
      if (isEdit) {
        values.id = formData.id;
        api.put(`/api/v1/profile/`, values)
          .then(response => {
            messageApi.open({
              type: 'success',
              content: 'Employee updated successfully',
            });
            setTimeout(() => {
              setConfirmLoading(false);
              onClose();
            }, 2000);
          })
          .catch(error => {
            console.log(error)
            setConfirmLoading(false);
            messageApi.open({
              type: 'error',
              content: 'Failed to update a employee',
            });
            console.error('Error fetching employees:', error);
          });
      } else if (!isEdit) {
        api.post(`/api/v1/employee/`, values)
          .then(response => {
            messageApi.open({
              type: 'success',
              content: 'Employee created successfully',
            });
            setTimeout(() => {
              setConfirmLoading(false);
              onClose();
            }, 2000);
          })
          .catch(error => {
            setConfirmLoading(false);
            messageApi.open({
              type: 'error',
              content: 'Failed to create a employee',
            });
            console.error('Error fetching employees:', error);
          });
      }
    }
    if (fileList && fileList.length) {
      handleUpload(fileList[0]?.originFileObj)
        .then(result => {
          if (result.success) {
            console.log('Upload succeeded:', result.message);
            values.profileImage = result?.message?.key;
            employeeApiCall(values);
            if (profileImage !== '' && profileImage !== null && profileImage !== undefined) {
              deleteBucketImage(profileImage);
            }
            getPresignedURL(values.profileImage).then(result => {
              if (result.success) {
                setProfileImage(result?.message);
              }
            })
            const profileUrl = getPresignedURL(result?.message?.key);
            setProfileImage(profileUrl);
          } else {
            console.log('Upload failed:', result.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      values.profileImage = profileData?.profile_image;
      employeeApiCall(values);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const normFile = (e) => {
    if (Array.isArray(e) && e?.fileList?.length) {
      // handleUpload()
      return e;
    }
    return e && e.fileList;
  };

  useEffect(() => {
    console.log(formData)
    return () => {
      if (formData?.hasOwnProperty('id') && formData?.id > 0) {
        api.get(`/api/v1/employee/${formData?.id}`)
          .then(response => {
            if (response?.data?.success && response?.data?.message?.length) {
              const data = response?.data?.message[0];
              setProfileData(data)
              const profile_image = data?.profile_image;
              if (profile_image !== '' && profile_image !== null && profile_image !== undefined) {
                getPresignedURL(profile_image).then(result => {
                  if (result.success) {
                    setProfileImage(result?.message);
                  }
                })
              }
              form.setFieldsValue({ firstName: data?.first_name, lastName: data?.last_name, email: data?.email, departmentId: data?.department_id, contactNumber: data?.contact_number,  });
            }
          })
          .catch(error => {
            console.error('Error fetching employees:', error);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit])

  console.log(profileImage)

  const [fileList, setFileList] = useState([]);

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      messageApi.open({
        type: 'warning',
        content: 'You can only upload image files!',
      });
    }
    return isImage ? false : Upload.LIST_IGNORE;
  };

  const handleChange = (info) => {
    setFileList(info?.fileList)
    console.log(info?.fileList)
    console.log(info?.fileList[0]?.originFileObj)
    setFileList(info.fileList.slice(-1)); // Keep only the latest file
  };

  const handleRemove = (file) => {
    setFileList([]);
  };

  return (
    <div>
      {contextHolder}
      {(profileImage !== '' && profileImage !== null && profileImage !== undefined) ? <Flex justify={'center'} align={'center'}> <div style={{ marginBottom: '3%' }}> <Image src={profileImage} preview={false} width={200} /> </div>  </Flex> : null}
      <Form
        name="profile"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        labelAlign="left"
        labelWrap
        onFinishFailed={onFinishFailed}
        labelCol={{ span: 6 }}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: 'Please enter your first name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: 'Please enter your last name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email!', type: 'email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Contact Number"
          name="contactNumber"
          rules={[
            { required: true, message: 'Please enter your contact number!' },
            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number!' },
          ]}
        >
          <Input />
        </Form.Item>

        <DepartmentFilter isProfile={true} />

        {isEdit &&
          <Form.Item
            label="Profile Image"
            name="profileImage"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Please upload a profile image"
          >
            <Upload
              fileList={fileList}
              beforeUpload={handleBeforeUpload}
              onChange={handleChange}
              onRemove={handleRemove}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
        }

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={confirmLoading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;

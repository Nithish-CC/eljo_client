import { Form, Select } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import api from '../../globals/interceptors';

const DepartmentFilter = ({ isProfile }) => {
    const [department, setDepartment] = useState([]);
    useEffect(() => {
        return () => {
            api.get(process.env.REACT_APP_BASE_URL + `/api/v1/department`)
                .then(response => {
                    if (response?.data?.message.length) {
                        const data = response?.data?.message.map((item) => ({ label: item.name, value: item.id }));
                        setDepartment(isProfile ? data : [{ label: "all", value: "all" }].concat(data))
                    }
                })
                .catch(error => {
                    console.error('Error fetching employees:', error);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    return (
        <Form.Item
            label="Department"
            name="departmentId"
            rules={[{ required: isProfile, message: 'Please select your department!' }]}
        >
            <Select
                defaultValue=""
                style={{ width: "100%" }}
                options={department}
            />
        </Form.Item>
    )
}

export default DepartmentFilter
import { Card, Flex, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import Profile from './Profile'
import { jwtDecode } from 'jwt-decode'

const EmployeeProfileEdit = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [decodedValue, setDecodedValue] = useState('');
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token !== null && token !== '' && token !== undefined) {
            const decoded = jwtDecode(token);
            setDecodedValue(decoded?.result);
            if (decoded?.result?.role === "employee") {
                setIsEdit(true)
            }
        }
    }, [token])

    const onClose = () => {
        return false
    }

    return (
        <Flex justify={"cemter"} align={"center"} style={{ margin: "auto", justifyContent: 'center' }}>
            <div style={{ margin: '20px' }}>

                <Card
                    title="Edit Profile"
                    bordered={false}
                    style={{
                        width: 800,
                    }}
                >
                    {isEdit ? <Profile isEdit={isEdit} formData={decodedValue} onClose={onClose} /> : <Skeleton active />}
                </Card>
            </div>

        </Flex>
    )
}

export default EmployeeProfileEdit
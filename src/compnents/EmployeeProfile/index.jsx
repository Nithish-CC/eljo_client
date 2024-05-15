import React from 'react'
import Profile from '../../pages/Profile/Profile'

const EmployeeProfile = ({isEdit,formData,onClose}) => {
    return (
       <Profile {...{isEdit,formData,onClose}}/>
    )
}

export default EmployeeProfile
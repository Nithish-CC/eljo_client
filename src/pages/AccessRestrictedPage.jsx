import React from 'react';
import { Result, Button } from 'antd';

const AccessRestrictedPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" href="/">Go to Login</Button>}
      />
    </div>
  );
};

export default AccessRestrictedPage;

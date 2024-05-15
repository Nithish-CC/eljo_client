import { Image, Menu, Button, Col, Typography, Layout } from "antd";
import { Link, useLocation } from "react-router-dom";
import { Row } from "antd";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
const { Text } = Typography;
const { Header } = Layout;

const AppHeader = () => {

    const [decodedValue, setDecodedValue] = useState('')
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token !== null && token !== '' && token !== undefined) {
            const decoded = jwtDecode(token);
            setDecodedValue(decoded)
        }
    }, [token])

    const HeaderStyle = {
        backgroundColor: "#FFF",
        borderBottom: "1px solid #60B046",
    };

    const locationPath = useLocation();

    const mainMenu = [
        {
            key: "/employees",
            label: <Link to={"/employees"}>Dashboard</Link>,
        }
    ];

    const emMenu = [
        {
            key: "/profile",
            label: <Link to={"/profile"}>Profile</Link>,
        }
    ];

    const Logout = () => {
        localStorage.removeItem("token");
        window.location.replace("/");
    }

    return (
        <>
            <Header style={HeaderStyle}>
                <Row className="flex justify-space-between align-items-center">
                    <Col md={5} lg={4} xs={12}>
                        <Image src={"https://img.icons8.com/color/48/react-native.png"} preview={false} style={{ width: "100%", height: '100%' }} />
                    </Col>
                    <Col md={12} lg={18} xs={0}>
                        <Menu
                            mode="horizontal"
                            items={decodedValue?.result?.role === "admin" ? mainMenu : emMenu}
                            defaultSelectedKeys={[locationPath.pathname]}
                            style={{ display: "flex", justifyContent: "center" }}
                        />
                    </Col>
                    <Col md={5} lg={2} xs={12}>
                        <Button onClick={()=>{Logout()}}><Text  type="success" strong>Logout</Text></Button>
                    </Col>
                </Row>
            </Header>
        </>
    );
};

export default AppHeader;

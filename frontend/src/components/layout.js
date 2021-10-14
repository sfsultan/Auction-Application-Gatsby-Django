import * as React from "react"
import { Layout, Row, Col, Menu, Typography, Space } from 'antd';
import { HomeOutlined, MobileOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { getUser, isLoggedIn, logout } from "../services/auth"
import { useStaticQuery, graphql } from "gatsby"
import { navigate } from "gatsby"
const { Header, Footer, Content } = Layout;
const { SubMenu } = Menu;
const { Text } = Typography;

const MainLayout = ({ children }) => {
    const { site } = useStaticQuery(
        graphql`
          query {
            site {
              siteMetadata {
                title
              }
            }
          }
        `
    )
    return (
        <Layout>
            <Header>
                <Row>
                    <Col lg={{ span: 3, offset: 4, push: 0 }} xs={{ span: 22, push: 6 }} >
                        <a href={'/'} >{site.siteMetadata.title}</a>
                    </Col>
                    <Col lg={{ span: 4, offset: 13, pull: 4 }} xs={{ span: 2, pull: 20 }} sm={{ span: 4 }}>
                        <Menu theme="dark" mode="horizontal" overflowedIndicator={<MenuOutlined />}>
                            {/* <Menu.Item key="1" icon={<HomeOutlined />}><a href="/">Home</a></Menu.Item> */}
                            {!isLoggedIn() ? (<Menu.Item key="2" ><a href="/login">Login</a></Menu.Item>) : null }
                            {isLoggedIn() ? (
                                <Menu.Item key="3" >
                                <a
                                    href="/items/list"
                                >
                                    Items List
                                </a>
                                </Menu.Item>
                            ) : null}
                            {isLoggedIn() ? (
                                <Menu.Item key="5" >
                                <a
                                    href="/autobid/"
                                >
                                    Autobid
                                </a>
                                </Menu.Item>
                            ) : null}
                            {isLoggedIn() ? (
                                <Menu.Item key="4" >
                                <a
                                    href="/"
                                    onClick={event => {
                                        event.preventDefault()
                                        logout(() => navigate(`/login`))
                                    }}
                                >
                                    Logout
                                </a>
                                </Menu.Item>
                            ) : null}

                        </Menu>
                    </Col>
                </Row>
            </Header>
            <Content style={{ padding: '20px 50px' }}>
                <Row>
                    <Col lg={{ span: 16, offset: 4 }} xs={{ span: 22, offset: 1 }} sm={{ span: 16, offset: 4 }}>{children}</Col>
                </Row>
            </Content>
            <Footer>
                <Row>
                    <Col lg={{ span: 16, offset: 4 }} xs={{ span: 24, offset: 0 }}>
                        <Space style={{ float: "left" }} wrap>
                            <a href="/">Home</a>
                            <a href="#">About Us</a>
                            <a href="#">Privacy</a>
                            <a href="#">Terms of Use</a>
                        </Space>
                    </Col>
                </Row>
            </Footer>
        </Layout>
    )
}

export default MainLayout

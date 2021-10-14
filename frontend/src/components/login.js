import React from "react"
import { navigate } from "gatsby"
import MainLayout from '../components/layout';
import { Row, Col, Form, Input, Button, Checkbox, Spin, Empty, Alert } from 'antd';
import { useState, useEffect } from "react";

import { handleLogin, isLoggedIn } from "../services/auth"


const Login = () => {
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isError, setIsError] = useState(false);

    const state = {
        username: ``,
        password: ``,
    };

    const onFinish = values => {
        console.log('Success:', values);

        var requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: values['username'],
                password: values['password'],
            })
        };

        fetch(`${process.env.GATSBY_BACKEND_API_URL}/login`, requestOptions)
            .then(response => {
                if (response.status === 404) {
                    alert("Not Found")
                }
                else if (response.status === 400) {
                    alert("Incorrect Username or Password")
                }
                else {
                    console.log(response);
                    return response.json();
                }
            })
            .then(result => {
                console.log(result);
                const login_result = handleLogin(result)
                navigate('/items/list');
            })
            .catch(error => {
                console.log('Error >> ')
                console.log('error', error)
            });




    };

    const onValuesChange = (changedValues, allValues) => {
        // console.log('onValuesChange:', changedValues);
        // console.log(Object.keys(changedValues));
        // console.log(Object.keys(changedValues)[0]);
        state[Object.keys(changedValues)[0]] = changedValues[Object.keys(changedValues)[0]];
        // console.log(state);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        var url = `${process.env.GATSBY_BACKEND_API_URL}`;
        setLoading(false);
    }, [])

    return (
        <MainLayout>
            {loading ? (
                <Spin size="large" width={"100%"} />
            ) : ((isError) ? (
                <p>There was a error</p>
            ) : (isEmpty) ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) :
                <Row style={{ height: '100%' }}>
                    <Col span={12} offset={6}>
                        <h1 style={{ marginTop: 10, marginBottom: 10 }}>Log in</h1>
                        <hr/>
                        <Alert message={<>Available Users:<br/><br/>Username: user1<br/>Password: 123<br/><br/>Username: user2<br/>Password: 123</>} type="warning" />
                        <Form
                            name="login"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onValuesChange={onValuesChange}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            style={{marginTop:30}}
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                                <Button type="primary" htmlType="submit"  block>
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            )}
        </MainLayout >
    )
}
export default Login

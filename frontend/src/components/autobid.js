import React from "react"
import { navigate } from "gatsby"
import MainLayout from '../components/layout';
import { message, Row, Col, Form, Input, Button, Checkbox, Spin, Empty, Alert, InputNumber, Space } from 'antd';
import { useState, useEffect } from "react";

import { getUser } from "../services/auth"


const AutoBid = () => {
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isError, setIsError] = useState(false);

    const [maxAmount, setMaxAmount] = useState(0);

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
                max_amount: values['max_amount'],
            })
        };

        const user = getUser()

        fetch(`${process.env.GATSBY_BACKEND_API_URL}/autobid/` + user['token'], requestOptions)
            .then(response => {
                console.log(response)
                if (response.status === 404) {
                    alert("User not found")
                }
                else if (response.status === 400) {
                    alert("Increase Your Bid")
                }
                else if (response.status === 200) {
                    message.success('Maximum autobid amount successfully set!');
                    return response.json();
                }
                else {
                    console.log(response);
                }
            })
            .then(result => {
                if (result['max_amount'] != null) {
                    setMaxAmount(result['max_amount']);
                }
                else {
                    setMaxAmount(0);
                }
                console.log(result);
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

        const user = getUser()

        var url = `${process.env.GATSBY_BACKEND_API_URL}/autobid/` + user['token'];

        fetch(url)
            .then(response => {
                if (response.status == 404) {
                    setIsEmpty(true);
                    navigate('/404');
                }
                return response.json()
            })
            .then(resultData => {
                // console.log(`${process.env.GATSBY_IMAGE_BASEURL}${resultData['device_images'][0]['filename']}`);
                console.log(resultData);
                if (Object.keys(resultData).length < 5) {
                    setIsEmpty(true);
                } else {
                    if (resultData['max_amount'] != null) {
                        setMaxAmount(resultData['max_amount']);
                    }
                    else {
                        setMaxAmount(1);
                    }
                }
                setLoading(false);

            }).catch(function (error) {
                console.log(error);
                setLoading(false);
                setIsError(true);
            });
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
                    <Col span={16} offset={8}>
                        <h1 style={{ marginTop: 10, marginBottom: 10 }}>Configure Autobidding</h1>
                        <hr/>
                        <p>Provide a maximum bid amount that will limit the auto bidding bot.</p>

                        <Alert message={<>Current maximum bid amount: <strong>${maxAmount}</strong></>} type="warning" />

                        <Form
                            name="login"
                            // labelCol={{ span: 18 }}
                            // wrapperCol={{ span: 18 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onValuesChange={onValuesChange}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            style={{marginTop:30}}
                        >
                            <Space direction="vertica">
                                <Form.Item
                                    name="max_amount"
                                    label="Maximum bid amount"
                                    rules={[{ required: true, message: 'Please input a budget amount!' }]}
                                >
                                    <InputNumber addonBefore="$" size="large" min={1} max={100000}  />
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                                    <Button type="primary" htmlType="submit" size='large'>
                                        Set
                                    </Button>
                                </Form.Item>
                            </Space>
                        </Form>
                    </Col>
                </Row>
            )}
        </MainLayout >
    )
}
export default AutoBid

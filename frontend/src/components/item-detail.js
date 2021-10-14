import * as React from "react"
import { useState, useEffect } from "react"
import { navigate } from "@reach/router"
import MainLayout from './/layout'
import { Timeline, Alert, Button, Statistic, Row, Col, Typography, Image, Card, Spin, Empty, Switch, InputNumber, Space, Form, message } from 'antd';
import { getUser } from "../services/auth"

import {
    HeartOutlined,
    RiseOutlined,
    DollarOutlined
} from '@ant-design/icons';

import moment from 'moment';


const { Countdown } = Statistic;
const excludeCols = ['id', 'device']
const { Title } = Typography

const fallback_string = "data:image/png;base64,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"


const ItemDetail = ({ id }) => {

    const [item, setItem] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isError, setIsError] = useState(false);

    const [autobidActive, setAutobidActive] = useState(false);
    const [bid_amount, setBidAmount] = useState(false);
    const [disable_bidding, setDisableBidding] = useState(false);

    const state = {
        bid_amount: null,
        disable_bidding: false
    };

    const onCountdownFinish = values => {
        setDisableBidding(true);
    }

    const onAutobidChange = value => {
        console.log(value);

        const user = getUser()

        var requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                autobid_activate: value,
                item_id: item['id']
            })
        };

        fetch(`${process.env.GATSBY_BACKEND_API_URL}/autobid-activate/` + user['token'], requestOptions)
            .then(response => {
                if (response.status === 404) {
                    message.error("Item not found")
                }
                else if (response.status === 400) {
                    message.error("Increase Your Bid")
                }
                else {
                    console.log(response);
                    return response.json();
                }
            })
            .then(result => {
                if (result['msg'] == 'Autobidding activated') {
                    setAutobidActive(true);
                } else if (result['msg'] == 'Autobidding deactivated') {
                    setAutobidActive(false);
                }
                console.log(result);
            })
            .catch(error => {
                console.log('Error >> ')
                console.log('error', error)
            });

    };
    const onFinish = values => {
        // console.log('Success:', values);
        const user = getUser()

        var requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bid_amount: bid_amount,
                token: user['token']
            })
        };

        fetch(`${process.env.GATSBY_BACKEND_API_URL}/place-bid/` + item['id'], requestOptions)
            .then(response => {
                if (response.status === 404) {
                    message.error("Item not found")
                }
                else if (response.status === 400) {
                    message.error("Increase Your Bid")
                }
                else {
                    console.log(response);
                    return response.json();
                }
                console.log(moment(item['closing_time']));
            })
            .then(result => {
                if (result) {
                    setItem(result);
                    message.success('Successfully placed a new bid');
                }
                console.log(result);
            })
            .catch(error => {
                console.log('Error >> ')
                console.log('error', error)
            });
    };

    const onValuesChange = (changedValues, allValues) => {
        console.log(changedValues);
        setBidAmount(changedValues[Object.keys(changedValues)[0]])
        // state[Object.keys(changedValues)[0]] = changedValues[Object.keys(changedValues)[0]];
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {

        const user = getUser();

        var url = `${process.env.GATSBY_BACKEND_API_URL}/item/` + id + `/` + user['token'];

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
                    setItem(resultData);
                    setBidAmount(parseInt(resultData['highest_bid']) + 1);
                    setAutobidActive(resultData['auto_bidding_active']);

                    console.log(resultData['closing_time']);
                    console.log(moment(resultData['closing_time']).format('LLLL'));
                    console.log(moment().format('LLLL'));
                    console.log(moment(resultData['closing_time']).isBefore(moment()));

                    if (moment(resultData['closing_time']).isBefore(moment())) {
                        setDisableBidding(true);
                    }
                    // state['bid_amount'] = parseInt(resultData['bid']) + 1;

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
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Spin size="large" width={"100%"} />
                    </Col>
                </Row>
            ) : ((isError) ? (
                <p>Error</p>
            ) : (isEmpty) ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) :
                <Row gutter={[20, 20]}>
                    <Col span={6}>
                        <Card bordered={false} style={{ padding: 0, marginBottom: 20 }}>
                            <Image
                                height={150}
                                alt={item['title']}
                                src={`${process.env.GATSBY_IMAGE_BASEURL}items/${item['thumbnail']}`}
                                preview={false}
                                fallback={fallback_string}
                            />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card id="link-specs" bordered={false} style={{ padding: 0, marginBottom: 20 }}>
                            <h2>{item['title']}</h2>
                            <hr />
                            <p>{item['description']}</p>

                            <Alert message={<>Bids Closing At : {moment(item['closing_time']).utc().format("LLLL z")}</>} type="warning" />

                            {(disable_bidding) && (<Alert message={<>Bidding Closed!</>} type="error" style={{ marginTop: 20 }} />)}

                            <Row style={{ marginTop: 20 }}>
                                <Col span={12}>
                                    <Countdown title="Time Left" value={moment(item['closing_time'])} format="D [Days] - H:m:s" onFinish={onCountdownFinish} />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Highest Bid"
                                        value={item['highest_bid']}
                                        precision={2}
                                        valueStyle={{ color: '#3f8600' }}
                                        suffix="$"
                                    />
                                </Col>
                            </Row>
                            <hr />
                            <h3>Make your bid</h3>
                            <Form
                                name="bids"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                onFinish={onFinish}
                                onValuesChange={onValuesChange}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Space>
                                    <Form.Item
                                        name="bid_amount"
                                    >
                                        <InputNumber addonBefore="$" size="large" min={parseInt(item['highest_bid']) + 1} max={100000} defaultValue={parseInt(item['highest_bid']) + 1} disabled={disable_bidding | autobidActive} />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" size='large' disabled={disable_bidding | autobidActive}> Submit Bid </Button>
                                    </Form.Item>
                                </Space>
                            </Form>
                            <Space>
                                <h3>Enable Autobidding: </h3>
                                <Switch onChange={onAutobidChange} checked={autobidActive} />
                            </Space>
                        </Card>
                        <Card bordered={false} style={{ padding: 0, marginBottom: 20 }}>
                            <h3>Bid History</h3>
                            <hr/>
                            <Timeline mode='left' style={{marginTop:50}}>
                                {item['bids'].map(({id, bid, created_at, bidder}) => (
                                    <Timeline.Item key={id} label={moment(created_at).format('LLLL') + " UTC"}>Received a bid of ${bid} - ({bidder})</Timeline.Item>
                                ))}
                            </Timeline>
                        </Card>

                    </Col>
                </Row>
            )}
        </MainLayout>
    )
}

export default ItemDetail

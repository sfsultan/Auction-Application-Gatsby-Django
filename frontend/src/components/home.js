import * as React from "react"
import { useState, useEffect } from "react";
import MainLayout from '../components/layout';
import { navigate } from "gatsby";
import { Spin, Empty, Pagination, Input, Space, Select  } from 'antd';
import ItemList  from "../components/item-list";
import { isLoggedIn, getUser } from "../services/auth"

const { Search } = Input;

const fallback_string = "data:image/png;base64,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"

function itemRender(current, type, originalElement) {
    if (type === 'page') {
        return <a>{current}</a>;
    }
    return originalElement;
}

const Home = ({ location }) => {

    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isError, setIsError] = useState(false);

    const [totalCount, setTotalCount] = useState(0);
    const [current, setCurrent] = useState(1);

    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortTerm, setSortTerm] = useState('');

    const state_params = {
        page:1,
        search:'',
        sort:'',
    };



    const onSortChange = value => {
        console.log(value);

        state_params['sort'] = value

        var requestOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        };

        setSortTerm(value);

        const params = new URLSearchParams(location.search);
        var url = `${process.env.GATSBY_BACKEND_API_URL}?`;
        console.log(params);
        if (params.has('price_sort')) {
            params.set('price_sort', value)
        } else {
            params.append('price_sort', value)
        }

        if (params.has('search')) {
            params.set('search', searchTerm)
        } else {
            params.append('search', searchTerm)
        }

        url = url + params.toString()

        console.log(url);

        fetch(url, requestOptions)
            .then(response => {
                if (response.status === 404) {
                    alert("Item not found")
                }
                else if (response.status === 400) {
                    alert("Increase Your Bid")
                }
                else {
                    console.log(response);
                    return response.json();
                }
            })
            .then(result => {
                if (result) {
                    setItems(result['results'])
                    setTotalCount(result.count);

                }
                console.log(result);
            })
            .catch(error => {
                console.log('Error >> ')
                console.log('error', error)
            });
    }

    const onSearch = value => {

        state_params['search'] = value

        var requestOptions = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        };

        setSearchTerm(value);

        const params = new URLSearchParams(location.search);
        var url = `${process.env.GATSBY_BACKEND_API_URL}?`;
        console.log(params);
        if (params.has('search')) {
            params.set('search', value)
        } else {
            params.append('search', value)
        }

        if (params.has('price_sort')) {
            params.set('price_sort', sortTerm)
        } else {
            params.append('price_sort', sortTerm)
        }

        url = url + params.toString()

        console.log(url);

        fetch(url, requestOptions)
            .then(response => {
                if (response.status === 404) {
                    alert("Item not found")
                }
                else if (response.status === 400) {
                    alert("Increase Your Bid")
                }
                else {
                    console.log(response);
                    return response.json();
                }
            })
            .then(result => {
                if (result) {
                    setItems(result['results'])
                    setTotalCount(result.count);

                }
                console.log(result);
            })
            .catch(error => {
                console.log('Error >> ')
                console.log('error', error)
            });

    }



    useEffect(() => {

        const params = new URLSearchParams(location.search);
        var url = `${process.env.GATSBY_BACKEND_API_URL}/?`;

        console.log(params);

        if (searchTerm) {
            if (params.has('search')) {
                params.set('search', searchTerm)
            } else {
                params.append('search', searchTerm)
            }
        }

        url = url + params.toString()

        const user = getUser()
        console.log(user);

        fetch(url)
            .then(response => {
                // console.log('Received Items >> ')
                // console.log(response)
                if (response.status === 404) {
                    setIsError(true);
                    // navigate('/404');
                }
                return response.json()
            })
            .then(resultData => {
                console.log(resultData);
                console.log(resultData.count);
                if (resultData['results'].length < 1) {
                    setIsEmpty(true);
                } else {
                    setItems(resultData['results']);
                    setTotalCount(resultData.count);
                }
                setLoading(false);

            }).catch(function (error) {
                console.log(error);
                setLoading(false);
                setIsError(true);
            });
    }, [])

    const onPagination = page => {

        state_params['page'] = page

        const params = new URLSearchParams(location.search);
        var url = `${process.env.GATSBY_BACKEND_API_URL}/?`;
        console.log(params);
        if (params.has('page')) {
            params.set('page', page)
        } else {
            params.append('page', page)
        }

        if (params.has('search')) {
            params.set('search', searchTerm)
        } else {
            params.append('search', searchTerm)
        }

        if (params.has('price_sort')) {
            params.set('price_sort', sortTerm)
        } else {
            params.append('price_sort', sortTerm)
        }



        url = url + params.toString()
        console.log(url);
        // navigate(location.origin + location.pathname + '?' +  params.toString());

        setCurrent(page);
        setLoading(true);
        setIsEmpty(false);
        fetch(url)
            .then(response => response.json())
            .then(resultData => {
                console.log(resultData);
                setLoading(false);
                if (resultData['results'].length < 1) {
                    setIsEmpty(true);
                } else {
                    setItems(resultData.results);
                }
            }).catch(function (error) {
                setLoading(false);
                setIsError(true);
                console.log(error)
            });
    };

    return (
        <MainLayout>
            <Space direction="vertical">
                    <Search placeholder="Search Item Title & Description" onSearch={onSearch} enterButton size="large" defaultValue={searchTerm} allowClear />
                    <Select placeholder="Sort by Price" onChange={onSortChange} style={{float:'right', width: 200}}>
                        <Select.Option value="desc" >Price Decending</Select.Option>
                        <Select.Option value="asc" >Price Ascending</Select.Option>
                    </Select>
            {loading ? (
                <Spin size="large" width={"100%"} />
            ) : ((isError) ? (
                <p>There was a error</p>
            ) : (isEmpty) ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) :
                <>
                    <ItemList items={items} style={{marginTop:30}} />
                    <Pagination
                        style={{ float: 'right', paddingBottom: 50 }}
                        current={current}
                        defaultCurrent={4}
                        onChange={onPagination}
                        total={totalCount}
                        showSizeChanger={false}
                        itemRender={itemRender}
                        defaultPageSize={10}
                    />
                </>
            )}
            </Space>
        </MainLayout>
    )
}

export default Home

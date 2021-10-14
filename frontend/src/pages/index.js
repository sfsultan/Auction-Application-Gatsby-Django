import * as React from "react"
import MainLayout from '../components/layout';
import { Button } from 'antd';

// markup
const IndexPage = () => {

    return (
        <MainLayout>
            <p>Welcome to My Awesome Auction Website!</p>
            <Button type="primary"><a href='/login'>Login Here</a></Button>
        </MainLayout>
    )
}

export default IndexPage

import * as React from "react"
import { Router } from '@reach/router'
import ItemDetail from '../components/item-detail'
import Login from '../components/login'
import Home from '../components/home'
import AutoBid from '../components/autobid'
import PrivateRoute from "../components/private-route";

const CustomRouter = () => {
    return (
        <Router>
            <PrivateRoute path='/items/detail/:id' component={ItemDetail} />
            <PrivateRoute path='/items/list' component={Home} />
            <PrivateRoute path='/autobid' component={AutoBid} />
            <Login path='/login'/>
        </Router>
    )
}

export default CustomRouter

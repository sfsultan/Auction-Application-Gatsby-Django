import React from "react"
import { navigate } from "gatsby"
import { isLoggedIn } from "../services/auth"


const PrivateRoute = ({ component: Component, location, ...rest }) => {
  if (!isLoggedIn() && location.pathname !== `/login`) {
      console.log('Inside Private Route!')
    navigate("/login")
    return null
  }
  return <Component location={location} {...rest} />
}

export default PrivateRoute

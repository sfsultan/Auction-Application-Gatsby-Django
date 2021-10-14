export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
    isBrowser() && window.localStorage.getItem("gatsbyUser")
        ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
        : {}

const setUser = user =>
    window.localStorage.setItem("gatsbyUser", JSON.stringify(user))

export const handleLogin = ({ username, token }) => {
    return setUser({
        username: username,
        token: token,
    })
}

export const isLoggedIn = () => {
    const user = getUser()
    return !!user.username
}

export const logout = callback => {
    setUser({})
    callback()
}

export const setAutobidBudget = ({ max_amount }) => {
    return window.localStorage.setItem("autobidBudget", JSON.stringify(max_amount))
}

export const getAutobidBudget = () => {
    return isBrowser() && window.localStorage.getItem("autobidBudget")
    ? JSON.parse(window.localStorage.getItem("autobidBudget"))
    : {}
}

import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)

    const { setUserInfo } = useContext(UserContext);

    async function login(e) {
        e.preventDefault();
        const response =
            await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            })
        if (response.status === 200) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            alert('Login failed');
        }
    }

    if (redirect)
        return <Navigate to='/' />

    return (
        <form className='login' onSubmit={login}>
            <h1>Login</h1>
            <input type="text" placeholder='username' value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder='password' value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    )
}

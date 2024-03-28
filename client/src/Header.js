import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header() {
    const {userInfo, setUserInfo} = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:4000/profile', { credentials: 'include' })
            .then(res => {
                res.json().then(userInfo => {
                    setUserInfo(userInfo);
                })
            });
    }, []);

    function logout() {
        fetch('http://localhost:4000/logout', { credentials: 'include', method: 'POST' })
            .then(() => setUserInfo(null));
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to="/" className="logo">My blog</Link>
            <nav>
                {username ?
                    <>
                        <Link to="/create">New post</Link>
                        <a onClick={logout}>Logout</a>
                    </> :
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                }
            </nav>
        </header>
    )
}

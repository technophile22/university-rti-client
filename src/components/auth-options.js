import React, { useContext, useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import UserContext from './admin/userContext';
import { SessionContext } from '../context/sessionContext';

export default function AuthOptions() {
	const { userData, setUserData } = useContext(UserContext);
	const { isLogin, setIsLogin, setAdminEmail } = useContext(SessionContext);
	const history = useHistory();

	const login = () => history.push('/login');

	const logout = () => {
		setIsLogin(false);
		localStorage.setItem('id', '');
		localStorage.setItem('isLoggedIn', false);
		localStorage.setItem('token', '');
		history.push('/login');
	};

	useEffect(() => {
		var check = JSON.parse(localStorage.getItem('isLoggedIn'));
		if (check === true) {
			setIsLogin(true);
		}
	}, []);

	return (
		<nav className='auth-options'>
			{isLogin ? (
				<button className='btn btn-primary mr-2' onClick={logout}>
					Logout
				</button>
			) : (
				<>
					<button className='btn btn-primary mr-2' onClick={login}>
						College Admin Login
					</button>
				</>
			)}
		</nav>
	);
}

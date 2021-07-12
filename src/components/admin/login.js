import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import '../css/form.css';
import axios from 'axios';
import { SessionContext } from '../../context/sessionContext';
import UserContext from './userContext';

import ErrorNotice from './error-notice';

export default function Login() {
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [error, setError] = useState();
	const history = useHistory();
	const { setUserData } = useContext(UserContext);
	const [loading, setLoading] = useState(false);
	const { isLogin, setIsLogin } = useContext(SessionContext);
	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const loginUser = { email, password };
		await axios
			.post('http://localhost:5000/api/admin/login', loginUser)
			.then((loginResponse) => {
				const value = loginResponse.data.token.split(' ')[1];
				localStorage.setItem('token', value);
				localStorage.setItem('isLoggedIn', true);
				localStorage.setItem('id', loginResponse.data.id);
				setIsLogin(true);
				history.push('/admin');
				setLoading(false);
			})
			.catch((err) => {
				console.log(err.response.data.message);
				err.response.data.message && setError(err.response.data.message);
				setLoading(false);
			});
	};

	return (
		<div className='Login'>
			<Form onSubmit={submit}>
				<h4 align='center' className='mt-5'>
					University Admin Login
				</h4>
				{error && (
					<ErrorNotice message={error} clearError={() => setError(undefined)} />
				)}
				<Form.Group size='lg' controlId='email' className='mt-5'>
					<Form.Label>Email</Form.Label>
					<Form.Control
						autoFocus
						type='email'
						id='email'
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group size='lg' controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						id='password'
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</Form.Group>
				<Button block size='lg' type='submit'>
					Login
				</Button>
			</Form>
		</div>
	);
}

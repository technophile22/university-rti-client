import React, { useContext, useEffect, useState } from 'react';
import { SessionContext } from '../../context/sessionContext';
import axios from 'axios';
import Loader from 'react-loader-spinner';

export default function AdminDetails(props) {
	const [college, setCollege] = useState('');
	const [loading, setLoading] = useState(false);
	const { setAdminCollege } = useContext(SessionContext);

	useEffect(() => {
		var id = localStorage.getItem('id');
		async function fetchMyAPI(id) {
			setLoading(true);
			await axios
				.get(`http://localhost:5000/api/admin/admin-info/${id}`)
				.then((response) => {
					console.log(response.data);
					setCollege(response.data.name);
					setAdminCollege(response.data.name);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err.response.data.message);
					setLoading(false);
				});
		}
		fetchMyAPI(id);
	}, []);

	if (loading) {
		return (
			<div style={{ marginTop: '150px', marginLeft: '40%' }}>
				<Loader type='ThreeDots' color='#333333' height='200' width='200' />
			</div>
		);
	}

	return <>Admin Info {college}</>;
}

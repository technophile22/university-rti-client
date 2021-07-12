// App.js
import React, { useMemo, useState, useEffect, useContext } from 'react';
import TableComponent from './table';
import axios from 'axios';
import { SessionContext } from '../../context/sessionContext';
import Loader from 'react-loader-spinner';

function AnsweredRTI({ setTab }) {
	const { adminCollege, setAnswerData, setRtiData, rtiData, answerData } =
		useContext(SessionContext);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	async function handleRTIAnswer(e) {
		var id = e.target.id;
		console.log(id);
		setLoading(true);
		await axios
			.get(`http://localhost:5000/api/admin/answer-rti-info/${id}`)
			.then((response) => {
				setAnswerData(response.data);
				console.log('result', answerData);
			})
			.catch((err) => {
				console.log(err.response.data.message);
				setLoading(false);
			});

		await axios
			.get(`http://localhost:5000/api/admin/info/${id}`)
			.then((response) => {
				console.log(response.data);
				setRtiData(response.data);
				setTab(5);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err.response.data.message);
				setLoading(false);
			});
	}

	useEffect(() => {
		(async () => {
			setLoading(true);
			await axios
				.get(`http://localhost:5000/api/admin/answered/${adminCollege}`)
				.then((response) => {
					console.log(response.data);
					setData(response.data);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err.response.data.message);
					setLoading(false);
				});
		})();
	}, []);

	const columns = useMemo(
		() => [
			{
				width: 100,
				Header: 'RTI ID',
				accessor: 'rti_id',
			},
			{
				Header: 'Name',
				accessor: 'name',
			},
			{
				Header: 'College',
				accessor: 'college',
			},
			{
				Header: 'Date',
				accessor: 'date',
				//this is the func your looking for, it can retuen custom tableCell
				Cell: (props) => {
					//props.value will contain your date
					//you can convert your date here
					const custom_date = props.value.toString().substring(0, 10);
					return <span>{custom_date}</span>;
				},
			},
			{
				Header: 'Status',
				accessor: 'status',
				//this is the func your looking for, it can retuen custom tableCell
				Cell: (props) => {
					//props.value will contain your date
					//you can convert your date here
					const status = props.value.toString();
					if (status === '0')
						return <span className='badge badge-primary'>In Progress</span>;
					if (status === '1')
						return <span className='badge badge-success'>Answered</span>;
					if (status === '2')
						return <span className='badge badge-danger'>Rejected</span>;
				},
			},
			{
				Header: 'Respond',
				accessor: '_id',
				//this is the func your looking for, it can retuen custom tableCell
				Cell: ({ cell }) => (
					<button
						id={cell.row.values._id}
						value={cell.row.values.name}
						className='btn btn-primary'
						onClick={handleRTIAnswer}>
						View
					</button>
				),
			},
		],
		[],
	);

	if (loading) {
		return (
			<div style={{ marginTop: '150px', marginLeft: '40%' }}>
				<Loader type='ThreeDots' color='#333333' height='200' width='200' />
			</div>
		);
	}

	return (
		<>
			<TableComponent loading={loading} columns={columns} data={data} />
		</>
	);
}

export default AnsweredRTI;

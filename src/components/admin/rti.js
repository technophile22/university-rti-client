import React, { useContext, useState } from 'react';
import { SessionContext } from '../../context/sessionContext';
import axios from 'axios';
import '../css/file.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyModal from './modal';
export default function RTIDetails({ setTab }) {
	const { rtiData } = useContext(SessionContext);
	const [selectedFile, setSelectedFile] = useState();
	const [textArea, setTextArea] = useState('');
	const [modalShow, setModalShow] = useState(false);

	const onChangeHandler = (event) => {
		var file = event.target.files[0];
		console.log(file);
		//console.log(this.validateSize(event));
		if (validateSize(event) && validateFormat(event)) {
			console.log(file);

			// if return true allow to setState
			setSelectedFile(file);
		}
	};

	// fileUploadHandler = () => {
	//     const data = new FormData()
	//     console.log(this.state.selectedFile);
	//     data.append('file', this.state.selectedFile)
	//     console.log(data);

	//     // axios.post("http://localhost:8010/api/v1/upload", data)
	//     //   .then(res => { // then print response status
	//     //     toast.success('upload success')
	//     //   })
	//     //   .catch(err => { // then print response status
	//     //     toast.error('upload fail')
	//     //   })

	// };

	const validateSize = (event) => {
		let file = event.target.files[0];
		let size = 1024;
		let err = '';
		const filesize = Math.round(file.size / 1024);
		console.log('filesize' + filesize);
		if (filesize > size) {
			err = file.type + 'is too large, please pick a smaller file\n';
			toast.error(err);
			return false;
		}
		return true;
	};

	const validateFormat = (event) => {
		let file = event.target.files;
		//let fileName = file.name;
		let err = '';

		//	if (file.type !== 'application/png') {
		//		err = file.type + 'is not valid, please pick a pdf file\n';
		//			toast.error(err);
		//			return false;
		//		}
		return true;
	};

	async function handleAnswer() {
		var id = rtiData._id;
		var admin_id = localStorage.getItem('id');
		const data = { answer: textArea, doc: selectedFile };
		console.log(data);
		console.log('result', data);

		await axios
			.post(`http://localhost:5000/api/admin/answer/${admin_id}/${id}`, data)
			.then((response) => {
				console.log(response);
				setModalShow(true);
			})
			.catch((err) => {
				console.log(err.response.data.message);
			});
	}

	async function handleReject() {
		var id = rtiData._id;
		var admin_id = localStorage.getItem('id');
		const data = { answer: textArea, doc: selectedFile };
		console.log(data);
		console.log('result', data);

		await axios
			.post(`http://localhost:5000/api/admin/reject/${admin_id}/${id}`, data)
			.then((response) => {
				console.log(response);
				setModalShow(true);
			})
			.catch((err) => {
				console.log(err.response.data.message);
			});
	}

	return (
		<>
			<h1>{rtiData.name}</h1>
			<textarea
				rows={4}
				onChange={(e) => setTextArea(e.target.value)}
				required
			/>

			<ToastContainer />
			<div className='form-group files'>
				<input
					type='file'
					name='doc'
					className='form-control'
					onChange={onChangeHandler}
				/>
			</div>

			<div>
				<button className='btn btn-success' onClick={handleAnswer}>
					Answer
				</button>
				<button className='btn btn-danger ml-4' onClick={handleReject}>
					Reject
				</button>
			</div>
			<MyModal show={modalShow} onHide={() => setTab(2)} />
		</>
	);
}

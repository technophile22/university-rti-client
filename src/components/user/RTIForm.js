import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import '../css/form.css';
import '../css/file.css';
import ReCaptchaV2 from 'react-google-recaptcha';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyModal from './mymodal';

class RTIForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fields: {
				college: 'RCA',
				name: '',
				gender: 'Male',
				address: '',
				pincode: '',
				country: 'India',
				state: '',
				phonenumber: '',
				email: '',
				request: '',
				document: '',
				captcha: '',
			},
			errors: {},
			human: false,
			result: {},
			modalShow: false,
			selectedFile: null,
		};
	}

	onChangeHandler = (event) => {
		var file = event.target.files[0];
		console.log(file);
		//console.log(this.validateSize(event));
		if (this.validateSize(event) && this.validateFormat(event)) {
			console.log(file);

			// if return true allow to setState
			this.setState({
				selectedFile: file,
			});
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

	validateSize = (event) => {
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

	validateFormat = (event) => {
		let file = event.target.files[0];
		//let fileName = file.name;
		let err = '';

		if (file.type !== 'application/pdf') {
			err = file.type + 'is not valid, please pick a pdf file\n';
			toast.error(err);
			return false;
		}
		return true;
	};

	// ReCAPTCHA Client Side
	onCaptchaLoad = () => {
		console.log('Captcha loaded.');
	};
	verifyCaptcha = (res) => {
		if (res) {
			this.setState({ human: true, humanKey: res });
		}
	};

	// ReCAPTCHA Expired
	expireCaptcha = () => {
		this.setState({ human: false, humanKey: null });
	};

	handleValidation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;

		let mpuatColleges = ['RCA', 'CDFT', 'CTAE', 'COF', 'CCAS', 'COA'];

		console.log(fields['college']);
		console.log(fields['name']);
		console.log(fields['gender']);
		console.log(fields['address']);
		console.log(fields['pincode']);
		console.log(fields['country']);
		console.log(fields['document']);

		//college
		if (!fields['college']) {
			formIsValid = false;
			errors['college'] = 'College cannot be empty';
		}

		if (typeof fields['college'] !== 'undefined') {
			if (!mpuatColleges.includes(fields['college'])) {
				formIsValid = false;
				errors['college'] = 'Only selected colleges allowed.';
			}
		}

		//Name
		if (!fields['name']) {
			formIsValid = false;
			errors['name'] = 'Name cannot be empty';
		}

		//Gender
		if (!fields['gender']) {
			formIsValid = false;
			errors['gender'] = 'Gender cannot be empty';
		}

		//Address
		if (!fields['address']) {
			formIsValid = false;
			errors['address'] = 'Adress cannot be empty';
		}

		//Pincode
		//6 digit positive
		if (!fields['pincode']) {
			formIsValid = false;
			errors['pincode'] = 'Pincode cannot be empty';
		} else if (!fields['pincode'].match(/^[0-9]{6}$/)) {
			formIsValid = false;
			errors['pincode'] = 'Invalid Pincode Number';
		}

		//State
		if (!fields['state']) {
			formIsValid = false;
			errors['state'] = 'State cannot be empty';
		}

		//Country
		if (!fields['country']) {
			formIsValid = false;
			errors['country'] = 'Country cannot be empty';
		}

		//Phone number
		//10 digit
		if (!fields['phonenumber']) {
			formIsValid = false;
			errors['phonenumber'] = 'Phone number cannot be empty';
		} else if (typeof fields['phonenumber'] !== 'undefined') {
			if (!fields['phonenumber'].match(/^[0-9]{10}$/)) {
				formIsValid = false;
				errors['phonenumber'] = 'Invalid Phone Number';
			}
		}

		//Email
		if (!fields['email']) {
			formIsValid = false;
			errors['email'] = 'Email Cannot be empty';
		}

		//Request
		if (!fields['request']) {
			formIsValid = false;
			errors['request'] = 'Request Cannot be empty';
		}

		//file upload
		//pdf
		//<1 mb

		//captcha
		if (!this.state.human) {
			formIsValid = false;
			errors['captcha'] = 'Please Verify Captcha';
		}

		this.setState({ errors: errors });
		return formIsValid;
	}

	async contactSubmit(e) {
		e.preventDefault();

		if (this.handleValidation()) {
			const data = {
				college: this.state.fields.college,
				name: this.state.fields.name,
				gender: this.state.fields.gender,
				address: this.state.fields.address,
				pincode: this.state.fields.pincode,
				country: this.state.fields.country,
				state: this.state.fields.state,
				phone: this.state.fields.phonenumber,
				email: this.state.fields.email,
				text: this.state.fields.request,
				file_data: this.state.selectedFile,
			};
			await axios
				.post('http://localhost:5000/user/upload', data)
				.then((response) => {
					console.log(response);
					this.setState({ result: response.data });
					this.setState({ modalShow: true });
					console.log('modal', this.state.modalShow);
				})
				.catch((error) => {
					console.error('There was an error!', error);
				});
			console.log('res', this.state.result);
			console.log('modal', this.state.modalShow);
		} else {
			this.state.human = false;
			this.captcha.reset();
			alert('Form has errors.');
		}
	}

	handleChange(field, e) {
		let fields = this.state.fields;
		fields[field] = e.target.value;
		this.setState({ fields });
	}

	render() {
		return (
			<>
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-md-12'>
							<div className='Login'>
								<Form onSubmit={this.contactSubmit.bind(this)}>
									<h4 align='center'>RTI Request Form</h4>

									<Form.Group size='lg' controlId='college'>
										<Form.Label>College</Form.Label>
										<Form.Control
											as='select'
											value={this.state.fields['college']}
											onChange={this.handleChange.bind(this, 'college')}>
											<option value='RCA'>
												RAJASTHAN COLLEGE OF AGRICULTURE (RCA), UDAIPUR
											</option>
											<option value='CDFT'>
												COLLEGE OF DAIRY AND FOOD TECHNOLOGY (CDFT), UDAIPUR
											</option>
											<option value='CTAE'>
												COLLEGE OF TECHNOLOGY AND ENGINEERING (CTAE), UDAIPUR
											</option>
											<option value='COF'>
												COLLEGE OF FISHERIES (COF), UDAIPUR
											</option>
											<option value='CCAS'>
												COLLEGE OF COMMUNITY AND APPLIED SCIENCE (CCAS), UDAIPUR
											</option>
											<option value='COA'>
												COLLEGE OF AGRICULTURE (COA), BHILWARA
											</option>
										</Form.Control>
										<span style={{ color: 'red' }}>
											{this.state.errors['college']}
										</span>
									</Form.Group>

									<Form.Group size='lg' controlId='name'>
										<Form.Label>Name</Form.Label>
										<Form.Control
											type='text'
											onChange={this.handleChange.bind(this, 'name')}
											value={this.state.fields['name']}
										/>
										<span style={{ color: 'red' }}>
											{this.state.errors['name']}
										</span>
									</Form.Group>

									<Form.Group size='lg' controlId='gender'>
										<Form.Label>Gender</Form.Label>
										<br />
										<Form.Check
											inline
											label='Male'
											name='gender'
											type='radio'
											id='inline-radio'
											value='Male'
											checked={this.state.fields['gender'] === 'Male'}
											onChange={this.handleChange.bind(this, 'gender')}
										/>

										<Form.Check
											inline
											label='Female'
											name='gender'
											type='radio'
											id='inline-radio'
											value='Female'
											checked={this.state.fields['gender'] === 'Female'}
											onChange={this.handleChange.bind(this, 'gender')}
										/>

										<Form.Check
											inline
											label='Other'
											name='gender'
											type='radio'
											id='inline-radio'
											value='Other'
											checked={this.state.fields['gender'] === 'Other'}
											onChange={this.handleChange.bind(this, 'gender')}
										/>
										<br />
										<span style={{ color: 'red' }}>
											{this.state.errors['gender']}
										</span>
									</Form.Group>

									<Form.Group size='lg' controlId='address'>
										<Form.Label>Address</Form.Label>
										<Form.Control
											type='text'
											onChange={this.handleChange.bind(this, 'address')}
											value={this.state.fields['address']}
										/>
										<span style={{ color: 'red' }}>
											{this.state.errors['address']}
										</span>
									</Form.Group>

									<Form.Group size='lg' controlId='pincode'>
										<Form.Label>Pincode</Form.Label>
										<Form.Control
											type='number'
											onChange={this.handleChange.bind(this, 'pincode')}
											value={this.state.fields['pincode']}
										/>
										<span style={{ color: 'red' }}>
											{this.state.errors['pincode']}
										</span>
									</Form.Group>

									<Form.Group size='lg' controlId='country'>
										<Form.Label>Country</Form.Label>
										<br />
										<Form.Check
											inline
											label='India'
											name='country'
											type='radio'
											id='inline-radio'
											value='India'
											checked={this.state.fields['country'] === 'India'}
											onChange={this.handleChange.bind(this, 'country')}
										/>

										<Form.Check
											inline
											label='Other'
											name='country'
											type='radio'
											id='inline-radio'
											value='Other'
											checked={this.state.fields['country'] === 'Other'}
											onChange={this.handleChange.bind(this, 'country')}
										/>
										<br />
										<span style={{ color: 'red' }}>
											{this.state.errors['country']}
										</span>
									</Form.Group>

									<Form.Group size='lg' controlId='state'>
										<Form.Label>State</Form.Label>
										<Form.Control
											type='text'
											onChange={this.handleChange.bind(this, 'state')}
											value={this.state.fields['state']}
										/>
										<span style={{ color: 'red' }}>
											{this.state.errors['state']}
										</span>
									</Form.Group>

									<Form.Group size='lg' controlId='phonenumber'>
										<Form.Label>Phone Number</Form.Label>
										<Form.Control
											type='text'
											onChange={this.handleChange.bind(this, 'phonenumber')}
											value={this.state.fields['phonenumber']}
										/>
										<span style={{ color: 'red' }}>
											{this.state.errors['phonenumber']}
										</span>
									</Form.Group>

									<Form.Group size='lg' controlId='email'>
										<Form.Label>Email</Form.Label>
										<Form.Control
											type='email'
											onChange={this.handleChange.bind(this, 'email')}
											value={this.state.fields['email']}
										/>
										<span style={{ color: 'red' }}>
											{this.state.errors['email']}
										</span>
									</Form.Group>

									<Form.Group size='lg' controlId='request'>
										<Form.Label>Request</Form.Label>
										<Form.Control
											as='textarea'
											rows={4}
											type='text'
											onChange={this.handleChange.bind(this, 'request')}
											value={this.state.fields['request']}
										/>
										<Form.Text className='text-muted'>
											Note:- Only alphabets A-Z a-z number 0-9 and special
											characters , . - _ ( ) / @ : & ? \ % are allowed in Text
											for RTI Request application.
										</Form.Text>
										<span style={{ color: 'red' }}>
											{this.state.errors['request']}
										</span>
									</Form.Group>

									{/* File input
                        <Form.Group size="lg" controlId="document">
                        <Form.Label>Supporting Document</Form.Label>
                        <Form.File id="formcheck-api-regular">
                            <Form.File.Input />
                        </Form.File>
                        <Form.Text className="text-muted">
                            Note:- (only pdf upto 1 MB)
                        </Form.Text>
                        <span style={{color: "red"}}>{this.state.errors["document"]}</span>
                        </Form.Group> */}

									<Form.Group size='lg' controlId='document'>
										<Form.Label>Supporting Document</Form.Label>
										<ToastContainer />
										<div className='form-group files'>
											<input
												type='file'
												name='file'
												className='form-control'
												onChange={this.onChangeHandler}
											/>
										</div>
										{/* <div className="col-md-6 pull-right">
                        <button width="100%" type="button" className="btn btn-info" onClick={this.fileUploadHandler}>Upload File</button>
                        </div> */}
										<Form.Text className='text-muted'>
											Note:- (only pdf upto 1 MB)
										</Form.Text>
										<span style={{ color: 'red' }}>
											{this.state.errors['document']}
										</span>
									</Form.Group>

									<Form.Group size='lg' controlId='captcha'>
										<ReCaptchaV2
											ref={(r) => (this.captcha = r)}
											sitekey={process.env.REACT_APP_SITE_KEY}
											onChange={this.verifyCaptcha}
											onExpired={this.expireCaptcha}
										/>
										<span style={{ color: 'red' }}>
											{this.state.errors['captcha']}
										</span>
									</Form.Group>

									<Button block size='lg' type='submit'>
										Submit
									</Button>
								</Form>
							</div>
						</div>
						<MyModal
							show={this.state.modalShow}
							onHide={() => {
								this.props.history.push('/');
							}}
							data={this.state.result}
						/>
					</div>
				</div>
			</>
		);
	}
}

export default RTIForm;

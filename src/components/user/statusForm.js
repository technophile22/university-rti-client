import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import '../css/form.css';
import '../css/file.css';
import ReCaptchaV2 from 'react-google-recaptcha';
import axios from 'axios';
import StatusModal from './statusModal';
class StatusForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fields: {
				id: '',
				phonenumber: '',
				email: '',
				captcha: '',
			},
			errors: {},
			modalShow: false,
			loading: false,
			human: false,
			data: {},
			answer: '',
			doc: '',
		};
	}

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

		//college
		if (!fields['id']) {
			formIsValid = false;
			errors['id'] = 'Application ID cannot be empty';
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
			this.setState({ loading: true });
			this.setState({ modalShow: true });
			const result = {
				email: this.state.fields.email,
				phone: this.state.fields.phonenumber,
			};
			console.log(
				'api',
				`http://localhost:5000/inquiry/user/${this.state.fields.id}`,
				result,
			);
			await axios
				.post(
					`http://localhost:5000/inquiry/user/${this.state.fields.id}`,
					result,
				)
				.then((response) => {
					this.setState({ data: response.data._doc });
					this.setState({ answer: response.data.answer });
					this.setState({ doc: response.data.doc });
					this.setState({ loading: false });
					console.log('data', this.state.data);
				})
				.catch((error) => {
					console.error('There was an error!', error);
				});
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
									<h4 align='center' className='mt-5'>
										RTI Status Form
									</h4>

									<Form.Group size='lg' controlId='id'>
										<Form.Label>Application ID</Form.Label>
										<Form.Control
											type='text'
											onChange={this.handleChange.bind(this, 'id')}
											value={this.state.fields['id']}
										/>
										<span style={{ color: 'red' }}>
											{this.state.errors['id']}
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
								<StatusModal
									loading={this.state.loading}
									show={this.state.modalShow}
									data={this.state.data}
									answer={this.state.answer}
									doc={this.state.doc}
									onHide={() => {
										this.state.modalShow = false;
										this.props.history.push('/');
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default StatusForm;

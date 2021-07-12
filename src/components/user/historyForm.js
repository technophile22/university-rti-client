import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import '../css/form.css';
import '../css/file.css';
import ReCaptchaV2 from 'react-google-recaptcha';
import axios from 'axios';

class HistoryForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fields: {
				phonenumber: '',
				email: '',
				captcha: '',
			},
			errors: {},
			human: false,
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

	contactSubmit(e) {
		e.preventDefault();

		if (this.handleValidation()) {
			alert('Form submitted');
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
										RTI History Form
									</h4>

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
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default HistoryForm;

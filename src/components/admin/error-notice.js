import React from 'react';
import { Alert } from 'react-bootstrap';

function ErrorNotice(props) {
	return (
		<div className='error-notice'>
			<Alert variant='danger' onClose={props.clearError} dismissible>
				{props.message}
			</Alert>
		</div>
	);
}
export default ErrorNotice;

import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import Loader from 'react-loader-spinner';

function StatusModal(props) {
	return (
		<Modal
			{...props}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered>
			{props.loading ? (
				<Loader type='ThreeDots' color='#333333' height='200' width='200' />
			) : (
				<>
					{' '}
					<Modal.Header closeButton>
						<Modal.Title id='contained-modal-title-vcenter'>
							Message
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>
							{props.data.status === 0 && (
								<h1>Your Request is Still in Process</h1>
							)}
							{props.data.status === 1 && (
								<>
									<h1>Your Request has been Answered</h1>
									<h1>{props.answer}</h1>
								</>
							)}
							{props.data.status === 2 && (
								<>
									<h1>Your Request has been Rejected</h1>
									<h1>{props.answer}</h1>
								</>
							)}
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={props.onHide}>Close</Button>
					</Modal.Footer>
				</>
			)}
		</Modal>
	);
}

export default StatusModal;

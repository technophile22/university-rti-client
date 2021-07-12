import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

function MyModal(props) {
	return (
		<Modal
			{...props}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered>
			<Modal.Header closeButton>
				<Modal.Title id='contained-modal-title-vcenter'>Message</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Your Response Has Been Submitted Successfully</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default MyModal;

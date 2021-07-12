import React, { useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './css/sidebar.css';
import AuthOptions from './auth-options';
import { SessionContext } from '../context/sessionContext';
function Header() {
	const { isLogin } = useContext(SessionContext);
	return (
		<>
			<Navbar collapseOnSelect expand='lg' bg='dark' variant='dark' fixed='top'>
				<Navbar.Brand href='/'>University RTI System</Navbar.Brand>
				<Navbar.Toggle aria-controls='responsive-navbar-nav' />
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='mr-auto'>
						{isLogin ? (
							<>
								<Nav.Link href='/admin'>My Account</Nav.Link>
							</>
						) : (
							<>
								<Nav.Link href='/submit-request'>Submit Request</Nav.Link>
								<Nav.Link href='/status'>View Status</Nav.Link>
								<Nav.Link href='/history'>View History</Nav.Link>
							</>
						)}
					</Nav>
					<Nav>
						<AuthOptions />
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</>
	);
}

export default Header;

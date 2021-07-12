import React, { useContext, useEffect, useState } from 'react';
import AdminDetails from '../admin/adminInfo';
import PendingRTI from '../admin/pendingRTI';
import AnsweredRTI from '../admin/answeredRTI';
import RTIDetails from '../admin/rti';
import AnsweredRTIDetails from '../admin/rti-answer';
import '../css/sidebar.css';

export default function AdminData() {
	const [tab, setTab] = useState(1);
	const handleAdmin = () => {
		setTab(1);
	};
	const handlePending = () => {
		setTab(2);
	};
	const handleAnswered = () => {
		setTab(3);
	};
	return (
		<div>
			<div className='left'>
				<div class='sidenav'>
					<a href='#about' onClick={handleAdmin}>
						Admin Info
					</a>
					<a href='#services' onClick={handlePending}>
						Pending
					</a>
					<a href='#answer' onClick={handleAnswered}>
						Answered
					</a>
				</div>
			</div>
			<div className='main'>
				{tab === 1 && <AdminDetails />}
				{tab === 2 && <PendingRTI tab={tab} setTab={setTab} />}
				{tab === 3 && <AnsweredRTI tab={tab} setTab={setTab} />}
				{tab === 4 && <RTIDetails setTab={setTab} />}
				{tab === 5 && <AnsweredRTIDetails />}
			</div>
		</div>
	);
}

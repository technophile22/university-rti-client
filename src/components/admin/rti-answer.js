import React, { useContext } from 'react';
import { SessionContext } from '../../context/sessionContext';
export default function AnsweredRTIDetails() {
	const { answerData, rtiData } = useContext(SessionContext);
	return (
		<>
			<h1>{answerData.answer}</h1>
			<h1>{rtiData.name}</h1>
		</>
	);
}

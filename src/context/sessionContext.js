import React, { createContext, useState } from 'react';

const SessionContext = createContext();

const SessionContextProvider = (props) => {
	const [isLogin, setIsLogin] = useState(false);
	const [adminCollege, setAdminCollege] = useState('');
	const [rtiData, setRtiData] = useState();
	const [answerData, setAnswerData] = useState();
	return (
		<SessionContext.Provider
			value={{
				isLogin,
				setIsLogin,
				adminCollege,
				setAdminCollege,
				rtiData,
				setRtiData,
				answerData,
				setAnswerData,
			}}>
			{props.children}
		</SessionContext.Provider>
	);
};

export { SessionContext, SessionContextProvider };

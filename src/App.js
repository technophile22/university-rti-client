import React, { useEffect, useState, useContext } from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import axios from 'axios';

import Header from './components/header';
import Login from './components/admin/login';
import AdminData from './components/pages/admin-data';
import StatusForm from './components/user/statusForm';
import RTIForm from './components/user/RTIForm';
import HistoryForm from './components/user/historyForm';
import PendingRTI from './components/admin/pendingRTI';
import UserContext from './components/admin/userContext';
import { SessionContextProvider } from './context/sessionContext';
import './App.css';

function App() {
	const [userData, setUserData] = useState({
		token: undefined,
		user: undefined,
	});

	return (
		<BrowserRouter>
			<UserContext.Provider value={{ userData, setUserData }}>
				<SessionContextProvider>
					<Header />

					<Switch>
						<Route exact path='/' component={Login} />
						<Route exact path='/submit-request' component={RTIForm} />
						<Route exact path='/status' component={StatusForm} />
						<Route exact path='/history' component={HistoryForm} />
						<Route exact path='/login' component={Login} />
						<Route exact path='/admin' component={AdminData} />
					</Switch>
				</SessionContextProvider>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;

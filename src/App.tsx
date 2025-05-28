import './App.css';
import { useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginComponent from './components/LoginComponent';
import { AuthService } from './services/AuthService';
import { DataService } from './services/DataService';
import CreateSpace from './components/spaces/CreateSpaces';
import Spaces from './components/spaces/Spaces';

const authService = new AuthService();
const dataService = new DataService(authService);

function App() {
	const [userName, setUserName] = useState<string | undefined>(undefined);

	const router = createBrowserRouter([
		{
			element: (
				<>
					<Navbar userName={userName} />
					<Outlet />
				</>
			),
			children: [
				{
					path: '/',
					element: <div>Hello world!!!</div>,
				},
				{
					path: '/login',
					element: <LoginComponent authService={authService} setUserNameCb={setUserName} />,
				},
				{
					path: '/profile',
					element: <div>Profile page!!!</div>,
				},
				{
					path: '/createSpace',
					element: <CreateSpace dataService={dataService} />,
				},
				{
					path: '/spaces',
					element: <Spaces dataService={dataService} />,
				},
			],
		},
	]);

	return (
		<div className='wrapper'>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;

import './App.css';
import { useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginComponent from './components/LoginComponent';
import { AuthService } from './services/AuthService';

const authService = new AuthService();

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
					element: <div>Create Space page!!!</div>,
				},
				{
					path: '/spaces',
					element: <div>Spaces page!!!</div>,
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

{
	/* 
    <CreateSpace dataService={dataService} />
    <Spaces dataService={dataService} />
  */
}

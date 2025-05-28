import './App.css';
import { useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';

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
					element: <div>Login Page!!!</div>,
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
    <LoginComponent authService={authService} setUserNameCb={setUserName} /> 
    <CreateSpace dataService={dataService} />
    <Spaces dataService={dataService} />
  */
}

import { NavLink } from 'react-router-dom';

type NavbarProps = {
	userName: string | undefined;
};
export default function Navbar({ userName }: NavbarProps) {
	function renderLoginLogout() {
		if (userName) {
			return (
				<NavLink to='/logout' style={{ float: 'right' }}>
					{userName}
				</NavLink>
			);
		} else {
			return (
				<NavLink to='/login' style={{ float: 'right' }}>
					Login
				</NavLink>
			);
		}
	}

	return (
		<div className='navbar'>
			<NavLink to={'/'}>Home</NavLink>
			<NavLink to={'/profile'}>Profile</NavLink>
			<NavLink to={'/spaces'}>Spaces</NavLink>
			<NavLink to={'/createSpace'}>Create space</NavLink>
			{renderLoginLogout()}
		</div>
	);
}

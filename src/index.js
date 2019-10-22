import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useRouteMatch,
	useParams
} from "react-router-dom";

import loadable from '@loadable/component'
const LoadedComponent = loadable(() => import('./components/LoadedComponent'))

const Main = () => (
	<Router>
		<App />
	</Router>
)

class App extends React.Component {
	render() {
		return (
			<div>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/about">About</Link>
					</li>
					<li>
						<Link to="/users">Users</Link>
					</li>
				</ul>

				<Switch>
					<Route path="/users">
						<Users />
					</Route>
					<Route path="/about">
						<About />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</div>
		)
	}
}

ReactDOM.render(<Main />, document.getElementById('app'))

function Home() {
	return <h2>Home</h2>
}

function Users() {
	let match = useRouteMatch();

	return (
		<div>
			<h2>Users</h2>;

			<ul>
				<li>
					<Link to={`${match.url}/user_1`}>User 1</Link>
				</li>
				<li>
					<Link to={`${match.url}/user_2`}>User 2</Link>
				</li>
			</ul>

			<Switch>
				<Route path={`${match.path}/:user`}>
					<UserInfo />
				</Route>
				<Route path={`${match.path}`}>
					Select a User
				</Route>
			</Switch>
		</div>
	)
}

function About() {
	return (
		<div>
			<h2>About</h2>;

			<LoadedComponent />
		</div>
	)
}

function UserInfo() {
	let { user } = useParams()

	return (
		<div>
			<h4>User Info</h4>

			The user is {user}
		</div>
	)
}
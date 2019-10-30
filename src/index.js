import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
	useRouteMatch,
	useParams,
	useHistory
} from "react-router-dom";

import loadable from '@loadable/component'
const LoadedComponent = loadable(() => import('./components/LoadedComponent'))

import Register from './components/Register';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';

import PubSub from 'pubsub-js';
import Auth from './AuthConfig';

const Main = () => (
	<Router>
		<App />
	</Router>
)

const App = () => {
	const [user, setUser] = useState(Auth.user);
	const [signedIn, setSignedIn] = useState(Auth.user.signedIn ? true : false)

	let history = useHistory();

	useEffect(() => {
		PubSub.subscribe('auth.signIn.success', function(){
			setUser(Auth.user)
			setSignedIn(true)

			history.replace({pathname: "/"})
		});

		PubSub.subscribe('auth.signOut.success', function(ev, msg) {
			history.replace({pathname: "/"})

			setUser({})
			setSignedIn(false)
		});
		
		return () => {
			PubSub.unsubscribe('auth.signIn.success')
			PubSub.unsubscribe('auth.signOut.success')
			console.log('unsubscribed user')
		}
	}, [])

	useEffect(() => {
		console.log('changing state')
	}, [user])

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
				{signedIn ? (
					<li>
						<Link to="/sign-out">Sign Out</Link>
					</li>
				) : (
						<li>
							<Link to="/sign-in">Sign In</Link>
						</li>
					)}
				{!signedIn &&
					<li>
						<Link to="/sign-up">Sign Up</Link>
					</li>
				}
			</ul>

			<Switch>
				<Route path="/users">
					<Users />
				</Route>
				<Route path="/about">
					<About />
				</Route>
				<Route path="/sign-up">
					<Register />
				</Route>
				<Route path="/sign-in">
					<SignIn />
				</Route>
				<PrivateRoute path="/sign-out">
					<SignOut />
				</PrivateRoute>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</div>
	)
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

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        Auth.user.signedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
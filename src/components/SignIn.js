import React, { useState } from 'react';

import Auth from '../AuthConfig';

const SignIn = () => {
	const [password, setPassword] = useState("")
	const [email, setEmail] = useState("")

	const submitHandler = () => {
		Auth.emailSignIn({
			email,
			password
		})
			.then(function (resp) {
				const user = resp.data
				console.log('Signed in')
				console.log(user)
			})
			.fail(function (resp) {
				console.log(resp)
				alert('Authentication failure');
			});
	}

	return (
		<div>
			<input type="text" name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
			<input type="text" name="password" onChange={(e) => setPassword(e.target.value)} value={password} />
			<button onClick={submitHandler}>Sign In</button>
		</div>
	)
}

export default SignIn
import React, { useState } from 'react';

import Auth from '../AuthConfig'

const Register = () => {
	const [password, setPassword] = useState("")
	const [passwordConfirmation, setPasswordConfirmation] = useState("")
	const [email, setEmail] = useState("")

	function submitHandler() {
		Auth.emailSignUp({
			email,
			password
		})
			.then(function (user) {
				console.log(user)
			})
			.fail(function (resp) {
				console.log(resp)
			});
	}

	return (
		<div>
			<input type="text" name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
			<input type="text" name="password" onChange={(e) => setPassword(e.target.value)} value={password} />
			<input type="text" name="password_confirmation" onChange={(e) => setPasswordConfirmation(e.target.value)} value={passwordConfirmation} />
			<button onClick={submitHandler}>Sign In</button>
		</div>
	)
}

export default Register;
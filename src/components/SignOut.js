import React from 'react';

import Auth from '../AuthConfig';

const SignOut = () => {
	function signOutHandler() {
		Auth.signOut()
			.then(function (resp) {
				console.log(resp)
			})
			.fail(function (resp) {
				console.log(resp)
			});
	}

	return (
		<div>
			<button onClick={signOutHandler}>Sign Out</button>
		</div>
	)
}

export default SignOut;
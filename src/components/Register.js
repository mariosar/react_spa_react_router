import React from 'react';

import Auth from '../AuthConfig'

export default class Register extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			password: "",
			password_confirmation: "",
			email: ""
		}

		this.onChange = this.onChange.bind(this)
		this.submitHandler = this.submitHandler.bind(this)
	}

	onChange(e) {
		const name = e.target.name
		const value = e.target.value

		this.setState({
			[name]: value
		})
	}

	submitHandler() {
		Auth.emailSignUp({
			email: this.state.email,
			password: this.state.password
		})
			.then(function (user) {
				console.log(user)
			})
			.fail(function (resp) {
				console.log(resp)
			});
	}

	render() {
		const { password, password_confirmation, email } = this.state;

		return (
			<div>
				<input type="text" name="email" onChange={this.onChange} value={email} />
				<input type="text" name="password" onChange={this.onChange} value={password} />
				<input type="text" name="password_confirmation" onChange={this.onChange} value={password_confirmation} />
				<button onClick={this.submitHandler}>Sign In</button>
			</div>
		)
	}
}
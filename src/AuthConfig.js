import Auth from 'j-toker';

Auth.configure({
	apiUrl: 'http://localhost:3000',
	signOutPath:           '/auth/sign_out',
  emailSignInPath:       '/auth/sign_in',
  emailRegistrationPath: '/auth',
  accountUpdatePath:     '/auth',
  accountDeletePath:     '/auth',
  passwordResetPath:     '/auth/password',
  passwordUpdatePath:    '/auth/password',
  tokenValidationPath:   '/auth/validate_token',
})

export default Auth
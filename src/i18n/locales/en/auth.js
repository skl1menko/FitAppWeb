const auth = {
    welcomeTitle: 'Welcome to PowerFit',
    welcomeSubtitle: 'Your journey to fitness starts here',
    loginTab: 'Log In',
    signupTab: 'Sign Up',
    continueWith: 'or continue with',
    google: 'Google',
    forgotPassword: 'Forgot Password?',
    termsPrefix: 'By continuing, you agree to our',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    login: {
        emailPlaceholder: 'Email',
        passwordPlaceholder: 'Password',
        submit: 'Log In',
        errorFallback: 'Login failed. Please try again.',
        submitting: 'Signing in...',
    },
    signup: {
        emailPlaceholder: 'Enter email address',
        fullNamePlaceholder: 'Enter your full name',
        passwordPlaceholder: 'Enter password',
        roleLabel: 'Select your role:',
        submit: 'Create Account',
        errorFallback: 'Registration failed',
    },
    googleCallback: {
        processing: 'Processing Google Sign-In...',
        almostDone: 'Almost done!',
        accountLabel: 'Account: {{email}}',
        rolePrompt: 'Choose your role to finish Google sign-in:',
        roleError: 'Please select your role to continue.',
        passwordPlaceholder: 'Create a password',
        passwordRequired: 'Please create a password to continue.',
        passwordHint: 'Password must be at least 8 characters long and include at least one letter and one number.',
        submit: 'Continue',
        submitting: 'Finishing...',
        errorFallback: 'Failed to complete Google sign-in',
    }
}

export default auth;

/**
 * Google Login Form
 * Authentication form for google to access google drive
 * Author: Kevin Ha
 */

import React from 'react';
import { browserHistory } from 'react-router';

// Styling
import { StyleSheet, css } from 'aphrodite';
import { Button, Well } from 'react-bootstrap';

// Import google app information
var GoogleConfig = require('../../backend/google');

class GoogleLoginForm extends React.Component {

	constructor(props) {
		super(props);
	}

    componentDidMount = () => {
        this.start();
    }

    // Load Google api Javascript libraries 
    start = () => {

        if (!gapi.auth2) window.gapi.load('client:auth2', this.initClient)
    }

    // Once login button is clicked, log in google user and connect to google api
    handleLoginClick = () => {
	    console.log('GoogleLoginForm.handleLoginClick')

        this.props.loginActions.loggingInUser();
        gapi.auth2.getAuthInstance().signIn({prompt: 'select_account'});
    }

    // Callback function for gapi load
    initClient = () => {
        // Initialize Javascript client
        gapi.client.init({
            apiKey: GoogleConfig.apiKey,
            clientId: GoogleConfig.clientId,
            scope: GoogleConfig.scope,
            discoveryDocs: GoogleConfig.discoveryDocs
        }).then(() => {
            var auth2 = gapi.auth2.getAuthInstance(); 

            // Listen for changes in current user's sign-in state
            auth2.isSignedIn.listen(this.updateSigninStatus);
            // Set current user for newly-initalized GoogleAuth instance, and also listen for changes in the current user
            auth2.currentUser.listen(this.updateUserStatus);

            // If user is already signed in due to not logging out properly before
            if (auth2.isSignedIn.get()) {
                this.props.loginActions.loggingInUser();
                this.responseGoogle(auth2.currentUser.get().getBasicProfile());
            }
        })
    }

    // Handle new google user 
    responseGoogle = (response) => {
        // Submit user into local database
        this.props.loginActions.registerUser({
            google_id: response.getId(),
            first_name: response.getGivenName(),
            last_name: response.getFamilyName(),
            email: response.getEmail(),
        })
        .then(() => {
            browserHistory.push('/Player');
        });
    }
    
    updateSigninStatus = (isSignedIn) => {
        // If user is logged in
        if (isSignedIn) {
            console.log('Logged in');
            if (!this.props.user.isLoggingOut) {
                this.responseGoogle(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile());
            }
        } else {
            console.log('Not logged in');
        } 
    }

    updateUserStatus = () => {
        console.log('User status updated');
    } 

	render() {
		return(
			<div className={css(styles.page)}>
                <Well className={css(styles.container)}>
                    <div className={css(styles.loginButton)}>
                        <Button bsStyle="danger" bsSize="large" block onClick={this.handleLoginClick}>Login with Google</Button>
                    </div>
                </Well>
			</div>
		);
	}
}

const styles = StyleSheet.create({
    page: {
        display: 'table',
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    container: {
        display: 'table-cell',
        margin: 'auto',
        verticalAlign: 'middle',
        width: '50%',
    },
    loginButton: {
        maxWidth: 400,
        margin: '0 auto 10px',
    },
})

export default GoogleLoginForm;
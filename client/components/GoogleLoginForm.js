/**
 * Google Login Form
 * Authentication form for google to access google drive
 * Author: Kevin Ha
 */

import React from 'react';
import { browserHistory } from 'react-router';

import Script from 'react-load-script';
import GoogleLogin from 'react-google-login';

// Import google app information
var GoogleConfig = require('../../backend/google');

class GoogleLoginForm extends React.Component {

	constructor(props) {
		super(props);
	}

    componentDidMount = () => {
        // this.start();
    }

    // Load Google api Javascript libraries 
    start = () => {
        window.gapi.load('client:auth2', this.initClient);
    }

    // Once login button is clicked, log in google user and connect to google api
    handleLoginClick = () => {
        gapi.auth2.getAuthInstance().signIn();
    }

    // Callback function for gapi load
    initClient = () => {
        // Initialize Javascript client
        window.gapi.client.init({
            apiKey: GoogleConfig.apiKey,
            clientId: GoogleConfig.clientId,
            scope: GoogleConfig.scope,
            discoveryDocs: GoogleConfig.discoveryDocs
        }).then(() => {
            // Listen for changes in current user's sign-in state
            gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
            // Set current user for newly-initalized GoogleAuth instance, and also listen for changes in the current user
            gapi.auth2.getAuthInstance().currentUser.listen(this.updateUserStatus);
        })
    }

    // Handle new google user 
    responseGoogle = (response) => {

        console.log('repeating from googleloginform');
        console.log(response);

        // Submit user into local database
        this.props.loginFunction.registerUser({
            google_id: response.getId(),
            first_name: response.getGivenName(),
            last_name: response.getFamilyName(),
            email: response.getEmail()
        })
        .then(() => {
            browserHistory.push('/Player');
        });
    }
    
    updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
            console.log('update status signed in');
        } else {
            console.log('update status not signed in');
            browserHistory.push('/Login');
        } 
    }

    updateUserStatus = (isSignedIn) => {
    	if (isSignedIn) {
            console.log('updateUserStatus true ' + this.props.loggingOut);

            // browserHistory.push('/Player');
            this.responseGoogle(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile());
            
        } else {
            console.log('updateUserStatus false');
        } 
    } 

    /*responseGoogle = (response) => {
        console.log(response);
        this.props.loginFunction.googleLogin(response)
        .then((data) => {
            if(data.isLoggedIn) {
                browserHistory.push('/Player');
            } else {
                console.log('data is not logging !!!!');
            }
        });
    }*/

	render() {
		return(
			<div>

                <Script
                    url='https://apis.google.com/js/api.js'
                    onLoad={this.start}
                    onError={this.start}
                ></Script>

                {/*<GoogleLogin
                    clientId="530735327961-7d2g6lfuij1q60f9ig0a73k6cah56mld.apps.googleusercontent.com"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    scope="https://www.googleapis.com/auth/drive.readonly"
                    discoveryDocs={["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]}
                />*/}

				<button onClick={this.handleLoginClick}>login</button>
			</div>
		);
	}
}

export default GoogleLoginForm;
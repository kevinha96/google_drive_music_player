
import {GoogleConfig} from "../backend/google"
import { browserHistory } from 'react-router';


export const GoogleLoginService = {

    isMounted: false,
    isLoggedIn: false,
    auth: null,
    user: null,

    mount() {

        console.log('GoogleLoginService.mount()', gapi)

        // - Load Google api Javascript libraries
        gapi.load('client:auth2', this.foo)
    },

    foo() {

        console.log('in foo')
    },

    initClient() {

        console.log('initClinet')

        // - Initialize Javascript client
        window.gapi.client.init({

            apiKey: GoogleConfig.apiKey,
            clientId: GoogleConfig.clientId,
            scope: GoogleConfig.scope,
            discoveryDocs: GoogleConfig.discoveryDocs
        }).then(() => {

            console.log('after init')

            this.isMounted = true

            // console.log('inside initClient')
            this.auth = window.gapi.auth2.getAuthInstance()

            // Listen for changes in current user's sign-in state
            this.auth.isSignedIn.listen(this.updateSigninStatus)

            // Set current user for newly-initalized GoogleAuth instance, and also listen for changes in the current user
            // auth2.currentUser.listen(this.updateUserStatus)

            // If user is already signed in due to not logging out properly before
            if (this.auth.isSignedIn.get()) {

                this.isLoggedIn = true
                this.props.loginActions.loggingInUser()
                this.responseGoogle(this.auth.currentUser.get().getBasicProfile())
            }
        }).catch((err) => {

            this.isMounted = false
            console.log('google api javascript initialization failed', err)
        })
    },

    // - Handle new google user
    responseGoogle(response) {

        // console.log('IN RESPONSE GOOGLE')

        this.user = response

        // Submit user into local database
        this.props.loginActions.registerUser({

            google_id: response.getId(),
            first_name: response.getGivenName(),
            last_name: response.getFamilyName(),
            email: response.getEmail(),
        }).then(() => {

            browserHistory.push('/Player')
        })
    },

    updateSigninStatus(isSignedIn) {

        // If user is logged in
        if (isSignedIn) {

            this.responseGoogle(window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile());
        } else {
            console.log('Not logged in');
        }
    },

    login() {

        window.gapi.auth2.getAuthInstance().signIn({prompt: 'select_account'});
    }
}
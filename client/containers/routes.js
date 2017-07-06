/**
* React Intro
* This is the routes of the app. Containers go here and containers will utilize the components.
* author: @
*/

import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { connect } from 'react-redux';

// Router
import { applyRouterMiddleware, Router, Route, IndexRoute, Redirect} from 'react-router';

// Containers
import LoginPage from '../containers/LoginPage.js'
import PlayerPage from '../containers/PlayerPage.js'

class Routes extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router history={this.props.history} routes={this._routes} onUpdate={() => window.scrollTo(0, 0)}>
                <Route path="/Login" component={LoginPage} />
                <Route path="/Player" component={PlayerPage} />
            </Router>
        );
    }
}


export default connect()(Routes)

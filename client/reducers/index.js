import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

module.exports = combineReducers({
    // routerReducer REQUIRED
    routing: routerReducer,
    // 
    user: require('./UserReducer'),
    playlist: require('./PlaylistReducer'),
    song: require('./SongReducer'),
});

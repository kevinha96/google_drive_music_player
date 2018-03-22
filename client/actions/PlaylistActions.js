/**
 * Playlist Actions
 * actions for playlist management
 * author: Kevin Ha
 */

import types from '../config/action-types';
import API from '../config/api';
import Helpers from './helpers';

function selectSongSuccessful(attr) {
    /*if (attr.dir == true) {
        return { 
            type: types.SELECT_PREV_SONG_SUCCESSFUL,
            id: attr.song.id,
            currentSong: attr.song.name,
            currentSongUrl: attr.song.url,
            songLocation: attr.songLocation,
            prevSongIndex: attr.prevSongIndex,
        }
    } else {*/
        return { 
            type: types.SELECT_SONG_SUCCESSFUL,
            id: attr.song.id,
            currentSong: attr.song.name,
            currentSongUrl: attr.song.url,
            songLocation: attr.songLocation,
            prevSong: attr.prevSong,
            prevSongIndex: attr.prevSongIndex,
        }
    //}
}

// Local Songs
function getLocalSongsSuccessful(songs) {
    return {
        type: types.GET_LOCAL_SONGS_SUCCESSFUL,
        songs: songs,
    }
}
function addLocalSongSuccessful(song) {
    return {
        type: types.ADD_LOCAL_SONG_SUCCESSFUL,
        songs: song,
    }
}
function deleteLocalSongSuccessful(id) {
    return {
        type: types.DELETE_LOCAL_SONG_SUCCESSFUL,
        id: id,
    }
}
function orderPlaylistSuccessful(order) {
    if (order.by == "name") {
        return {
            type: types.ORDER_LOCAL_BY_NAME_SUCCESSFUL,
            orderDir: order.dir,
        }
    } else if (order.by == "time") {
        return {
            type: types.ORDER_LOCAL_BY_TIME_SUCCESSFUL,
            orderDir: order.dir,
        }
    }
}

// Queue
function addToQueueSuccessful(song) {
    return { 
        type: types.ADD_TO_QUEUE_SUCCESSFUL,
        queue: song,
    }
}
function rearrangeQueueSuccessful(song) {
    return {
        type: types.REARRANGE_QUEUE_SUCCESSFUL,
        id: song.id,
    }
}

// Custom Playlists
function getPlaylistsSuccessful(json) {
    return {
        type: types.GET_PLAYLISTS_SUCCESSFUL,
        playlists: json,
    }
}
function createNewPlaylistSuccessful(json) {
    return {
        type: types.CREATE_NEW_PLAYLIST_SUCCESSFUL,
        playlists: json,
    }
}
function getPlaylistSongsSuccessful(json) {
    return {
        type: types.GET_PLAYLIST_SONGS_SUCCESSFUL,
        playlistSongs: json,
    }
}
function addToPlaylistSuccessful() {
    return {
        type: types.ADD_TO_PLAYLIST_SUCCESSFUL,
    }
}
function deleteFromPlaylistSuccessful(id) {
    return {
        type: types.DELETE_FROM_PLAYLIST_SUCCESSFUL,
        id: id,
    }
}
function clearPlaylistSongsSuccessful() {
    return {
        type: types.CLEARPLAYLISTSONGS,
    }
}
function orderCustomPlaylistSuccessful(order) {
    if (order.by == "name") {
        return {
            type: types.ORDER_CUSTOM_BY_NAME_SUCCESSFUL,
            orderDir: order.dir,
        }
    } 
}

function caughtError(error) {
    return {
        type: types.CAUGHT_ERROR_SUCCESSFUL,
        error: error,
    }
}

module.exports = {
    // Selecting song from playlist
    selectSong: function selectSong(attr) {
        return dispatch => {
            return dispatch(selectSongSuccessful(attr));
        }
    },

/********** Local Songs **********/
    // Pulling songs from local database
    getLocalSongs: function getLocalSongs(attr) {
        return dispatch => {
            return fetch(API.LOCAL_PLAYLIST, API.POST_CONFIG(attr))
            .then(Helpers.checkState)
            .then(Helpers.parseJSON)
            .then((json) => {
                return dispatch(getLocalSongsSuccessful(json));
            })
            .catch((error) => {
                return dispatch(caughtError(error));
            });
        }
    },
    // Adding songs to local database
    addLocalSong: function addLocalSong(attr) {
        let endpoint;
        endpoint = API.LOCAL_PLAYLIST + 'add/';
        return dispatch => {
            return fetch(endpoint, API.POST_CONFIG(attr))
            .then(Helpers.checkState)
            .then(Helpers.parseJSON)
            .then((json) => {
                return dispatch(addLocalSongSuccessful(json));
            })
            .catch((error) => {
                return dispatch(caughtError(error));
            })
        }
    },
    // Deleting songs from local database
    deleteLocalSong: function deleteLocalSong(attr) {
        let endpoint;
        endpoint = API.LOCAL_PLAYLIST + 'delete/';
        return dispatch => {
            return fetch(endpoint, API.POST_CONFIG(attr))
            .then(Helpers.checkState)
            .then(Helpers.parseJSON)
            .then(() => {
                return dispatch(deleteLocalSongSuccessful(attr.songId));
            })
            .catch((error) => {
                return dispatch(caughtError(error));
            })
        }
    },
    // Order local playlist by name or time added
    orderPlaylist: function orderPlaylist(order) {
        return dispatch => {
            return dispatch(orderPlaylistSuccessful(order));
        }
    },

/********** Queue **********/
    // Add song to queue
    addToQueue: function addToQueue(song) {
        return dispatch => {
            return dispatch(addToQueueSuccessful(song));
        }
    },
    // Rearrange queue by deleting the song in queue
    rearrangeQueue: function rearrangeQueue(song) {
        return dispatch => {
            return dispatch(rearrangeQueueSuccessful(song));
        }
    },

/********** Custom Playlists **********/
    // Get full list of playlists
    getPlaylists: function getPlaylists(attr) {
        let endpoint;
        endpoint = API.PLAYLIST + 'user/' + attr.userId + '/';
        return dispatch => {
            return fetch(endpoint, API.POST_CONFIG(attr))
            .then(Helpers.checkState)
            .then(Helpers.parseJSON)
            .then((json) => {
                return dispatch(getPlaylistsSuccessful(json));
            })
            .catch((error) => {
                return dispatch(caughtError(error));
            });
        }
    },
    // Make new playlist
    createNewPlaylist: function createNewPlaylist(attr) {
        let endpoint;
        endpoint = API.PLAYLIST + attr.name + '/';
        return dispatch => {
            return fetch(endpoint, API.PUT_CONFIG(attr))
            .then(Helpers.checkState)
            .then(Helpers.parseJSON)
            .then((json) => {
                return dispatch(createNewPlaylistSuccessful(json));
            })
            .catch((error) => {
                return dispatch(caughtError(error));
            })
        }
    },
    // Get music of selected playlist
    getPlaylistSongs: function getPlaylistSongs(attr) {
        let endpoint;
        endpoint = API.PLAYLIST + attr.playlistId + '/';
        return dispatch => {
            return fetch(endpoint, API.POST_CONFIG(attr))
            .then(Helpers.checkState)
            .then(Helpers.parseJSON)
            .then((json) => {
                return dispatch(getPlaylistSongsSuccessful(json));
            })
            .catch((error) => {
                return dispatch(caughtError(error));
            });
        }
    },
    // Add music to playlist
    addToPlaylist: function addToPlaylist(attr) {
        let endpoint;
        endpoint = API.PLAYLIST + attr.playlistId + '/add/';
        return dispatch => {
            return fetch(endpoint, API.POST_CONFIG(attr))
            .then(Helpers.checkState)
            .then(Helpers.parseJSON)
            .then((json) => {
                return dispatch(addToPlaylistSuccessful());
            })
            .catch((error) => {
                return dispatch(caughtError(error));
            })
        }
    },
    // Delete music from playlist
    deleteFromPlaylist: function deleteFromPlaylist(attr) {
        let endpoint;
        endpoint = API.PLAYLIST + attr.playlistId + '/delete/';
        return dispatch => {
            return fetch(endpoint, API.POST_CONFIG(attr))
            .then(Helpers.checkState)
            .then(Helpers.parseJSON)
            .then(() => {
               return dispatch(deleteFromPlaylistSuccessful(attr.songId));
            })
            .catch((error) => {
                return dispatch(caughtError(error));
            })
        }
    },
    // Order custom playlist by name or time added
    orderCustomPlaylist: function orderCustomPlaylist(order) {
        return dispatch => {
            return dispatch(orderCustomPlaylistSuccessful(order));
        }
    },
    // Helper function to clear playlistSongs
    clearPlaylistSongs: function clearPlaylistSongs() {
        return dispatch => {
            return dispatch(clearPlaylistSongsSuccessful());
        }
    }
}         


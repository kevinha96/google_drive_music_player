/**
 * Player Page
 * Main page of the app with the audio player
 * author: Kevin Ha
 */

import React from 'react';

// Bootstrap
import { Modal, FormControl, Button, FormGroup, HelpBlock } from 'react-bootstrap';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

// Playlist
import LocalPlaylist from '../components/LocalPlaylist'; 
// Audio Player
import AudioPlayer from '../components/AudioPlayer';
// Google Drive Componenet
import GoogleDrivePlaylist from '../components/GoogleDrivePlaylist';
// Queue Componenet
import Queue from '../components/Queue';
// Tab Bar
import TabBar from '../components/TabBar';
// Custom playlist
import CustomPlaylist from '../components/CustomPlaylist';
// Add to playlist popup
import PlaylistsModal from '../components/PlaylistsModal';
// Navigation Bar
import NavBar from '../components/NavBar';

// Playlist Actions
import PlaylistActions from '../actions/PlaylistActions';
// Login Actions
import LoginActions from '../actions/LoginActions';


class PlayerPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playlist: 'local',
            showDropdownModal: false,
            showPlaylistModal: false,
            clickedSong: {},
            newPlaylistName: "",
            customPlaylist: [],
        }
    }

    // Before component loads get the songs and playlists
    componentWillMount() {
        if (this.props.user.isLoggedIn == false) {
            browserHistory.push('/Login');
            return null; // For some reason this is getting ignored
        } else {
            let attr = {userId: this.props.user.id};
            this.props.playlistActions.getLocalSongs(attr);
            this.props.playlistActions.getPlaylists(attr);
        }
    }

    // Handles tab choice in the TabBar component
    choosePlaylist = (event) => {        
        if (event == "1") {this.setState({playlist: 'local'})}
        else if (event == "2") {this.setState({playlist: 'google'})}
        else if (event == "3") {this.setState({playlist: 'queue'})}
    }
    
    // Handles creating new playlist for the TabBar dropdown new playlist modal
    handleCreatePlaylist = () => {
        // Make new playlist
        let attr = {
            name: this.state.newPlaylistName,
            user_id: this.props.user.id,
        }
        this.props.playlistActions.createNewPlaylist(attr).then((json) => {
            this.props.playlistActions.clearPlaylistSongs();
            let playlist = json.playlists;
            
            this.setState({
                playlist: 'playlist',
                customPlaylist: playlist,
            });

            this.closeDropdownModal();
        });
    }

    // Open new playlist modal for dropdown button in TabBar
    openDropdownModal = () => {
        this.setState({showDropdownModal: true});
    }

    // Close new playlist modal 
    closeDropdownModal = () => {
        this.setState({showDropdownModal: false});
    }

    // Handle new playlist name in new playlist modal
    handleChange = (event) => {
        this.setState({newPlaylistName: event.target.value});
    }

    // Handle playlist click in dropdown in TabBar
    handleDropdownPlaylistClick = (playlist) => {
        let attr = {
            playlistId: playlist.id
        }
        this.props.playlistActions.getPlaylistSongs(attr).then(() => {
            this.setState({
                playlist: 'playlist',
                customPlaylist: playlist,
            })
        })
    }

    // Handle add to playlist button in local playlist, custom playlist, and queue
    handlePlaylistButton = (song) => {
        this.setState({ 
            showPlaylistModal: true,
            clickedSong: song,
        });
    }

    // Close new playlist modal from playlists
    cancel = () => {
        this.setState({ showPlaylistModal: false});
    }

    // Validation State for search bar
    getValidationState = (playlists) => {
        let newName = this.state.newPlaylistName;
        let unique = _.filter(playlists, ['name', newName]);

        if (newName.length > 0 && unique.length == 0) {return 'success'}
        else {return 'error'}
    }

    render() {
        let { playlist, playlistActions, loginActions, user, song } = this.props;

        // Returning null again when the user is not logged in because the return statement is getting ignored in componentWillMount for some reason
        if (user.isLoggedIn == false) {
            return null;
        }

        let chosenPlaylist = null;
        if (this.state.playlist == 'local') {
            chosenPlaylist = <LocalPlaylist 
                                handlePlaylistButton={this.handlePlaylistButton}
                                playlist={playlist}
                                playlistActions={playlistActions} 
                                song={song} />;
        } else if (this.state.playlist == 'google') {
            chosenPlaylist = <GoogleDrivePlaylist playlistActions={playlistActions} song={song} user={user} />;
        } else if (this.state.playlist == 'queue') {
            chosenPlaylist = <Queue handlePlaylistButton={this.handlePlaylistButton} playlistActions={playlistActions} queue={playlist.queue} song={song} />;
        } else if (this.state.playlist == 'playlist') {
            chosenPlaylist = <CustomPlaylist 
                                customPlaylist={this.state.customPlaylist} 
                                handlePlaylistButton={this.handlePlaylistButton} 
                                playlist={playlist} 
                                playlistActions={playlistActions}
                                song={song} />;
        }

        return (
            <div>
                <NavBar loginActions={loginActions} user={user} />
                
                <AudioPlayer playlist={playlist} playlistActions={playlistActions} song={song} /> <br />
                
                <TabBar 
                    choosePlaylist={this.choosePlaylist} 
                    openDropdownModal={this.openDropdownModal} 
                    handleDropdownPlaylistClick={this.handleDropdownPlaylistClick} 
                    playlists={playlist.playlists} />

                <Modal show={this.state.showDropdownModal} onHide={this.closeDropdownModal}>
                    <Modal.Header closeButton>
                        <Modal.Title id="create-playlist-modal">Create a new playist</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup controlId="formBasicText" validationState={this.getValidationState(playlist.playlists)}>
                            <FormControl type="text" placeholder="New Playlist" onChange={this.handleChange} />
                            <FormControl.Feedback />
                            <HelpBlock>Create a unique playlist name</HelpBlock>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeDropdownModal}>Cancel</Button>
                        <Button onClick={this.handleCreatePlaylist}>Create</Button>
                    </Modal.Footer>
                </Modal>

                <PlaylistsModal 
                    clickedSong={this.state.clickedSong} 
                    onHide={this.cancel} 
                    playlists={playlist.playlists}
                    playlistActions={playlistActions} 
                    show={this.state.showPlaylistModal}
                    user={user} />

                {chosenPlaylist}
            </div>        
        );
    }
}


// REDUX
function mapStateToProps(state) {
    return { 
        playlist: state.playlist,
        song: state.song,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        playlistActions: bindActionCreators(PlaylistActions, dispatch),
        loginActions: bindActionCreators(LoginActions, dispatch),
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(PlayerPage);

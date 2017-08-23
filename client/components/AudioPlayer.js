/**
 * Audio Player
 * Wrapper for the HTML Audio tag implementation
 * Author: Kevin Ha
 */

import React from 'react';

var _ = require('lodash');

// React wrapper for HTML 5 audio tag
import ReactAudioPlayer from 'react-audio-player';

// Aphrodite
import { StyleSheet, css } from 'aphrodite';
// Bootstrap
import { Button, Navbar } from 'react-bootstrap';

class AudioPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        	queue: [],
        }
    }

    // Play previous song
    /*handlePrevSong = () => {
        var { song, playlistActions } = this.props;
        var newIndex = song.prevSongIndex + 1;
        console.log(song.prevSongs[song.prevSongs.length -newIndex]);
        var attr = {
                songLocation: "history",
                song: song.prevSongs[song.prevSongs.length -newIndex],
                prevSongIndex: newIndex,
                dir: true,
            }
        playlistActions.selectSong(attr);
    }*/

    // Play next song when song ends or next song is clicked
    handleNextSong = () => {
        var { playlist, playlistActions, song } = this.props;

        // If not playing from history
        if (song.prevSongIndex < 2) {
            // If queue is not empty 
            if (playlist.queue.length > 0) {
                var nextSong = playlist.queue[0];
                var attr = {
                    songLocation: "queue",
                    song: nextSong,
                    prevSong: {id: song.id, name: song.currentSong, url: song.currentSongUrl},
                    prevSongIndex: 0,
                }
                playlistActions.selectSong(attr);
                playlistActions.rearrangeQueue(nextSong);
            } else { // If queue is empty play next song from custom or local playlist
                var idArray; var i; var attr;

                if (song.songLocation == "local") {
                    idArray = _.map(playlist.songs, 'id');
                    i = _.indexOf(idArray, song.id);

                    // if not at end of playlist
                    if (i+1 < playlist.songs.length) {
                        attr = {
                            songLocation: "local",
                            song: playlist.songs[i+1],
                            prevSong: {id: song.id, name: song.currentSong, url: song.currentSongUrl},
                            prevSongIndex: 0,
                        }
                        playlistActions.selectSong(attr);
                    }
                } else if (song.songLocation == "custom") {
                    idArray = _.map(playlist.playlistSongs, 'id');
                    i = _.indexOf(idArray, song.id);
                    
                    // If not at end of playlist
                    if (i+1 < playlist.playlistSongs.length) {
                        attr = {
                            songLocation: "local",
                            song: playlist.playlistSongs[i+1],
                            prevSong: {id: song.id, name: song.currentSong, url: song.currentSongUrl},
                            prevSongIndex: 0,
                        }
                        playlistActions.selectSong(attr);
                    }
                }
            }
        } else {
            var newIndex = song.prevSongIndex - 1;

            var attr = {
                    songLocation: "history",
                    song: song.prevSongs[song.prevSongs.length -newIndex],
                    prevSongIndex: newIndex,
                    dir: true,
                }
            playlistActions.selectSong(attr);
        }
    }

    render() {
    	var { song } = this.props;
        var prev = '<';
        var next = '>';

        return (
            <Navbar fluid fixedBottom>
                <Navbar.Text className={css(styles.song)}>Currently Playing: {song.currentSong}</Navbar.Text><br /><br />

                <Button className={css(styles.button)} disabled onClick={this.handlePrevSong}>{prev}</Button>
                <Button className={css(styles.button)} onClick={this.handleNextSong}>{next}</Button>

                <div className={css(styles.player)}>
                    <ReactAudioPlayer
                        className={css(styles.controls)}
                        src={song.currentSongUrl} 
                        controls
                        autoPlay 
                        onEnded={this.handleNextSong} /> 
                </div>
            </Navbar>
            
        );
    } 
}

const styles = StyleSheet.create({
    player: {
        overflow: 'hidden',
        display: 'inlineBlock'
    },
    button: {
        height: '30px',
        width: '40px',
        float: 'left'
    },
    controls: {
        width: '100%'
    },
    song: {
        margin: '5px'
    }
})

export default AudioPlayer;
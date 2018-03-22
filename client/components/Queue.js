/**
* Queue Component
* Lists song queue 
* author: Kevin Ha
*/

import React from 'react';

// Aphrodite
import { StyleSheet, css } from 'aphrodite';
// Bootstrap 
import { DropdownButton, MenuItem, Table, thead, tr, th, tbody } from 'react-bootstrap';

class Queue extends React.Component {

	constructor(props) {
		super(props);
	}

	// Play song and delete that song from queue
	handleClick = (song) => {
		let attr = {
                songLocation: "queue",
                song: song,
                prevSong: (({ id, currentSong, currentSongUrl }) => ({ id, currentSong, currentSongUrl }))(this.props.song),
                prevSongIndex: 0,
            }
        this.props.playlistActions.selectSong(attr);
		this.props.playlistActions.rearrangeQueue(song);
	}

	// Delete song from queue
	handleDeleteButton = (song) => {
		this.props.playlistActions.rearrangeQueue(song);
	}

	render() {
		let { queue, handlePlaylistButton } = this.props;

		return (
			<div className={css(styles.tab)}> 
				<h4>Queue:</h4>
				
				<Table striped bordered hover>
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
					{
						queue.map((song) => {
							return (
								<tr key={song.id}>
									<td>
										<DropdownButton title="-" noCaret id="queueOptions" bsSize="xsmall">
                                        	<MenuItem onClick={() => this.handleDeleteButton(song)}>Remove Song</MenuItem>
                                        	<MenuItem onClick={() => handlePlaylistButton(song)}>Add Song to Playlist</MenuItem>
                                    	</DropdownButton>
                                    </td>
									<td value={song} onClick={() => this.handleClick(song)}>{song.name}</td>
								</tr>
							)
						})
					}
					</tbody>
				</Table>

			</div>
		)
	}
}

const styles = StyleSheet.create({
    tab: {
        marginBottom: '80px'
    }
})

export default Queue;
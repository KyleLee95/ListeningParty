//front end
import io from 'socket.io-client'

import musicPlayerEvent from './music-player'
import store, {getMessage, addNewTrack} from './store'
import {setPlaylist, addTrack} from './store/playerState/playlist'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Socket Connected!')
  socket.on('new-message', message => {
    if (store.getState().channel.selectedChannel.id === message.channelId) {
      store.dispatch(getMessage(message))
    }
  })

  const {channel: {selectedChannel}, user} = store.getState()

  if (selectedChannel.ownerId === user.id) {
    socket.on('request-received', (song, requester) => {
      if (
        confirm(
          `Listener ${requester.id} reqested ${song.title} by ${song.artist} from the album ${
            song.album
          }\nAdd to play list?`
        )
      )
        store.dispatch(addNewTrack(song))
    })
  }
})

socket.on('channel-set-playlist', playlist => {
  store.dispatch(setPlaylist(playlist))
})
socket.on('channel-add-track', trackData => {
  store.dispatch(addTrack(trackData))
})

socket.on('received-state-change', playerState =>
  musicPlayerEvent.emit('state-received', playerState)
)

socket.on('new-listener', function(listenerId) {
  const {channel: {selectedChannel}, user, player} = store.getState()
  const isOwner = selectedChannel.ownerId === user.id
  return (
    isOwner &&
    player
      .getCurrentState()
      .then(playerState => socket.emit('owner-state-changed', listenerId, playerState))
  )
})

export default socket

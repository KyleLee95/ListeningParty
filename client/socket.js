//front end
import io from 'socket.io-client'

import musicPlayerEvent from './music-player'
import store, {getMessage, addNewTrack} from './store'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Socket Connected!')

  socket.on('new-message', message => {
    store.dispatch(getMessage(message))
  })
  const {channel: {selectedChannel}, user} = store.getState()
  if (selectedChannel.ownerId === user.id) {
    socket.on('request', (song, requester) => {
      // store.dispatch( getMessage( {user: requester, userId: requester.id, channelId: selectedChannel.id, content: `Listener ${ requester.id} reqested ${song.title} by ${song.artist}`}))
      if (
        confirm(
          `Listener ${requester.id} reqested ${song.title} by ${
            song.artist
          } from the album ${song.album}\nAdd to play list?`
        )
      )
        store.dispatch(addNewTrack(song))
    })
  }
})

socket.on('received-state-change', playerState => {
  musicPlayerEvent.emit('state-received', playerState)
})

socket.on('new-listener', function(listenerId) {
  const {channel: {selectedChannel}, user, player} = store.getState()
  return (
    isOwner &&
    player
      .getCurrentState()
      .then(playerState =>
        socket.emit('owner-state-changed', listenerId, playerState)
      )
  )
})

socket.on('sync-to-channel')

export default socket

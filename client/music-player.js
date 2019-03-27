import {EventEmitter} from 'events'
import socket from './socket'
import store, {playTrack, togglePause, seekTrack} from './store'

const musicPlayerEvent = new EventEmitter()

/**
 * handler for musicPlayerEvents when the player state changes
 * emit event to other socket when it is triggered by the channel owner
 */
const handleStateChanged = (playerState, dispatch, getState) => {
  console.log('state changed!!!:', playerState)
  // get current channel, track and user from the state
  const {channel: {selectedChannel}, user, player} = getState()
  // id of the current channel participating
  const channelId = selectedChannel.id
  // determine if the triggered player is owner's
  const isChannelOwner = selectedChannel.ownerId === user.id
  // if it was triggered by channel owner's player, manage all the listeners
  if (isChannelOwner) {
    socket.emit('owner-state-changed', channelId, playerState)
  }
  const {paused, track_window: {current_track: {uri}}, position} = playerState
}

// listener for state change in spotify player
musicPlayerEvent.on('state-changed', handleStateChanged)

// ***** HANDLING HOST'S STATE CHANGE *****//

// helper for determining what to update
const getChangedState = (
  isChannelPaused,
  channelTrackUri,
  channelPosition,
  myPlayer
) =>
  myPlayer.getCurrentState().then(playerState => {
    if (!playerState)
      return {shouldTogglePlay: true, shouldChangeTrack: true, shouldSeek: true}
    const listenerTrackUri = playerState.track_window.current_track.uri
    // should we change track
    const shouldChangeTrack = channelTrackUri !== listenerTrackUri
    // depending on uri change, listener's player will automatically play
    const isListenerPaused = shouldChangeTrack ? false : playerState.paused
    // should we toggle playback?
    const shouldTogglePlay = isChannelPaused !== isListenerPaused
    // if we're playing new uri, listener's position will be at 0 mark
    const listenerPosition = shouldChangeTrack ? 0 : playerState.position
    // should we seek through track?
    // apply 3 second frame to account for latency
    const shouldSeek =
      channelPosition > listenerPosition + 3000 ||
      channelPosition < listenerPosition - 3000
    return {shouldTogglePlay, shouldChangeTrack, shouldSeek}
  })

// promise creator for calling thunks to update the listener's player
const resolveStateChange = (uri, paused, position) => ({
  shouldTogglePlay,
  shouldChangeTrack,
  shouldSeek
}) =>
  Promise.resolve(shouldChangeTrack && store.dispatch(playTrack(uri)))
    .then(() => shouldTogglePlay && store.dispatch(togglePause(paused)))
    .then(() => shouldSeek && store.dispatch(seekTrack(position)))
/**
 * handler for when channel owner's player state changes
 * subscribed to listening players only when listener requests
 * check store/playerState/isListening.js
 * @param {WebPlaybackState} playerState
 * TODO:
 * - seek music
 */
export const handleStateReceived = receivedState => {
  // if received state is null, and our player is active, pause it just in case
  if (!receivedState)
    return store.getState().player && store.dispatch(togglePause(true))
  // extract needed state from owner's player
  const {paused, track_window: {current_track: {uri}}, position} = receivedState
  // call the helper promise to determine the needed adjustment
  return getChangedState(paused, uri, position, store.getState().player).then(
    whatStateToChange =>
      resolveStateChange(uri, paused, position)(whatStateToChange)
  )
}

// ***** END *****//

// when listener clicks the 'start listening' button
export const handleStartListening = channelId => {
  // subscribe listening
  musicPlayerEvent.on('state-received', handleStateReceived)
  // update listener player with channel-owner's state
  socket.emit('request-channel-state', channelId, socket.id)
}

// when listener clicks the 'stop listening' button
export const handleStopListening = () => {
  // pauses track
  store.dispatch(togglePause(true))
  // unsubscribe listening
  musicPlayerEvent.removeListener('state-received', handleStateReceived)
}

musicPlayerEvent.on('start-listening', handleStartListening)
musicPlayerEvent.on('stop-listening', handleStopListening)

export default musicPlayerEvent

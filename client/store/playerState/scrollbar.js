const SET_POSITION = 'SET_POSITION'
const SET_ID = 'SET_ID'

// sets the position in milisecond on state
export const setPosition = position => ({type: SET_POSITION, position})

export const setId = id => ({type: SET_ID, id})

// start moving bar when playing
export const startTick = (trackLength, callback) => (dispatch, getState) => {
  const intervalId = getState().intervalId
  // don't dispatch another setInterval if intervalId is 0
  if (intervalId) return
  const scrubbingSpeed = 1000 / trackLength
  dispatch(setId(setInterval(callback, scrubbingSpeed)))
}

// stop moving bar when pausing
export const stopTick = () => (dispatch, getState) => {
  const intervalId = getState().intervalId
  if (!intervalId) return
  clearInterval(intervalId)
  dispatch(setId(0))
}

// reducer for duration.
// integer in milisecond

const initialState = {
  position: 0,
  intervalId: 0
}

export default function(state = initialState, action) {
  if (action.type === SET_POSITION) return {...state, position: action.position}
  if (action.type === SET_ID) return {...state, intervalId: action.id}
  return state
}

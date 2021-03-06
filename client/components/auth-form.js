import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import {Button, Row, Col, Card, Container, Jumbotron} from 'react-bootstrap'
import {Link} from 'react-router-dom'
/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <Container>
      <Jumbotron
        className="custom-center-align"
        style={{backgroundColor: 'white'}}
      >
        <Row>
          <Col xs={12}>
            <Card border="light">
              <Card.Title>
                {' '}
                <h4>Login With</h4>
              </Card.Title>
              <form onSubmit={handleSubmit} name={name}>
                <label htmlFor="email">
                  <small>Email</small>
                </label>
                <input name="email" type="text" />

                <label htmlFor="password">
                  <small>Password</small>
                </label>
                <input name="password" type="password" />
                <br />
                <br />
                {/* <Row> */}
                {error && error.response && <div> {error.response.data} </div>}
                {/* </Row> */}
                <Button type="submit">{displayName}</Button>
              </form>

              {/* <Row>
              <Col xs={3} />
              <Col xs={6}>or</Col>
              <Col xs={3} />
            </Row> */}
              {/* <hr /> */}
              <hr />
              <Row>
                <Col xs={12}>
                  {' '}
                  <h4>Or</h4>
                </Col>
              </Row>

              <a href="/auth/spotify">
                <img src="/Spotify_Logo_RGB_Green.png" />
                {/* <Button variant="success">{displayName} with Spotify</Button> */}
              </a>
            </Card>
          </Col>
        </Row>
      </Jumbotron>
    </Container>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}

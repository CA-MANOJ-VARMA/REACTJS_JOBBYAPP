import './index.css'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class LoginForm extends Component {
  state = {username: '', password: '', errormsgboolean: false, errorMessage: ''}

  onChangeUsernameFunction = event => {
    this.setState({username: event.target.value})
  }

  onChangePasswordFunction = event => {
    this.setState({password: event.target.value})
  }

  submitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  errormsgFunction = errormsg => {
    this.setState({errormsgboolean: true, errorMessage: errormsg})
  }

  onSubmitFunction = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = ' https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const JsonData = await response.json()

    console.log(JsonData.jwt_token)
    if (response.ok === true) {
      this.submitSuccess(JsonData.jwt_token)
    } else {
      this.errormsgFunction(JsonData.error_msg)
    }
  }

  render() {
    const {username, password, errormsgboolean, errorMessage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <>
        <div className="css-login-whole-container">
          <div
            style={{
              borderStyle: 'solid',
              borderColor: 'black',
              marginBottom: '50px',
              padding: '5px',
            }}
          >
            <p>
              To SignIn - USERNAME - &apos;rahul&apos; and PASSWORD -
              &apos;rahul@2021&apos;
            </p>
          </div>
          <form className="css-login-div">
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="css-login-website-logo"
              />
            </div>
            <div className="css-login-input-div">
              <label htmlFor="username">USERNAME</label>
              <br />
              <input
                placeholder="Username"
                id="username"
                type="text"
                className="css-login-input"
                onChange={this.onChangeUsernameFunction}
                value={username}
              />
            </div>
            <div className="css-login-input-div">
              <label htmlFor="password">PASSWORD</label>
              <br />
              <input
                placeholder="Password"
                id="password"
                type="password"
                className="css-login-input"
                onChange={this.onChangePasswordFunction}
                value={password}
              />
            </div>
            <div>
              <button
                type="submit"
                className="css-button-login"
                onClick={this.onSubmitFunction}
              >
                Login
              </button>
            </div>

            {errormsgboolean ? (
              <p className="css-errorMessage-paragraph">{`*${errorMessage}`}</p>
            ) : (
              ''
            )}
          </form>
        </div>
      </>
    )
  }
}
export default LoginForm

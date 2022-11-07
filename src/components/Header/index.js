import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const deleteFunction = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div style={{margin: '0'}}>
      <ul className="css-Header-navbar">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="css-Header-logo"
            />
          </Link>
        </li>
        <li className="css-Header-ul">
          <Link to="/" className="css-Header-li">
            <p>Home</p>
          </Link>
          <Link to="/jobs" className="css-Header-li">
            <p>Jobs</p>
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="css-Header-logout"
            onClick={deleteFunction}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)

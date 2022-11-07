import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <div className="css-Home-container">
      <div>
        <Header />
      </div>
      <div className="css-Home-view-container">
        <h1 className="css-Home-heading">
          Find The Job that <br /> Fits Your Life
        </h1>
        <p className="css-Home-paragraph">
          Millions of people are searching for jobs,
          <br /> salary information, company reviews. <br />
          Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="css-Home-FindJobs" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default Home

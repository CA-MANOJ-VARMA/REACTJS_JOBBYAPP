import {BsBriefcaseFill, BsSearch} from 'react-icons/bs'
import {ImLocation} from 'react-icons/im'
import {FcRating} from 'react-icons/fc'
import {Link} from 'react-router-dom'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'
import Header from '../Header'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apistatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}
class Jobs extends Component {
  state = {
    userDetails: '',
    jobsList: [],
    searchText: '',
    apistatusProfile: apistatusConstants.initial,
    apistatusJobs: apistatusConstants.initial,
    employementType: [],
    salaryRange: [],
  }

  componentDidMount() {
    this.profileLoader()
    this.jobDetailsFunctions()
  }

  //   componentWillUnmount() {
  //     this.profileLoader()
  //   }

  searchTextFunction = event => {
    console.log(event)
    this.setState({searchText: event.target.value})
  }

  jobDetailsFunctions = async () => {
    const {employementType, salaryRange, searchText} = this.state
    console.log(salaryRange)
    this.setState({apistatusJobs: apistatusConstants.progress})
    const jwtToken = Cookies.get('jwt_token')

    const baseApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employementType}&minimum_package=${salaryRange}&search=${searchText}`
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    console.log(baseApiUrl)
    const response = await fetch(baseApiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const jsonData = await response.json()
      console.log(jsonData)
      const jobsListData = jsonData.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        apistatusJobs: apistatusConstants.success,
        jobsList: jobsListData,
      })
    }
    if (response.status === 404) {
      this.setState({apistatusJobs: apistatusConstants.failure})
    }
  }

  profileLoader = async () => {
    this.setState({apistatusProfile: apistatusConstants.progress})
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = await data.profile_details
      this.setState({
        userDetails: profileDetails,
        apistatusProfile: apistatusConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({apistatusProfile: apistatusConstants.failure})
    }

    // const {profile_details} ={data.name,data.profile_image_url,data.short_bio}
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  successProfileView = () => {
    const {userDetails} = this.state
    // const {name, profile_image_url, short_bio} = userDetails
    const username = userDetails.name

    const imageUrl = userDetails.profile_image_url
    const shortBio = userDetails.short_bio
    return (
      <div className="css-Header-jobs-page-profile-div">
        <img src={imageUrl} alt="profile" className="css-jobs-profile" />
        <h1>{username}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  failureProfileView = () => {
    console.log('failure view')
    return (
      <>
        <div>
          <button
            type="button"
            className="css-Jobs-FindJobs"
            onClick={this.profileLoader()}
          >
            Retry
          </button>
        </div>
      </>
    )
  }

  profileloaderFunction = apistatusProfile => {
    switch (apistatusProfile) {
      case apistatusConstants.success:
        return this.successProfileView()
      case apistatusConstants.progress:
        return this.renderLoader()
      case apistatusConstants.failure:
        return this.failureProfileView()
      default:
        return null
    }
  }

  successJobsView = () => {
    const {jobsList, searchText} = this.state
    return (
      <div>
        <ul className="css-Jobs-ul">
          <li className="css-jobs-input-list" key="search">
            <input
              type="search"
              value={searchText}
              onChange={this.searchTextFunction}
              className="css-jobs-input"
              placeholder="search here"
            />
            <button
              type="button"
              className="css-Jobs-button"
              onClick={this.jobDetailsFunctions}
            >
              <BsSearch className="search-icon" />
            </button>
          </li>
          {jobsList.length === 0 ? (
            <div className="css-jobs-no-jobs-found">
              <img
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                alt="no jobs"
                className="css-jobs-nojobs-image"
              />
              <h1>No Jobs Found</h1>
              <p>We could not find any jobs. Try other filters.</p>
            </div>
          ) : (
            jobsList.map(jobItem => (
              <li className="css-Jobs-jobslist-div" key={jobItem.id}>
                <Link to={`/jobs/${jobItem.id}`} className="css-jobs-link">
                  <div className="css-Jobs-title-div">
                    <div>
                      <img
                        src={jobItem.companyLogoUrl}
                        alt="company logo"
                        className="css-Jobs-logo"
                      />
                    </div>
                    <div>
                      <p style={{fontWeight: 'bold', fontSize: '20px'}}>
                        {jobItem.title}
                      </p>
                      <p style={{display: 'flex', alignItems: 'center'}}>
                        <FcRating />
                        {jobItem.rating}
                      </p>
                    </div>
                  </div>
                  <div className="css-Jobs-location-salary-div">
                    <div className="css-Jobs-location-div">
                      <div className="css-Jobs-location-para">
                        <ImLocation />
                        <p>{jobItem.location}</p>
                      </div>
                      <div className="css-Jobs-location-para">
                        <BsBriefcaseFill />
                        <p>{jobItem.employmentType}</p>
                      </div>
                    </div>
                    <p>{jobItem.packagePerAnnum}</p>
                  </div>
                  <hr />
                  <p>{jobItem.title}</p>
                  <p>{jobItem.jobDescription}</p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    )
  }

  failureJobsView = () => {
    console.log('failure view')
    return (
      <>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
          />
          <div style={{color: 'white'}}>
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for</p>
          </div>
          <button
            type="button"
            className="css-Jobs-FindJobs"
            onClick={this.jobDetailsFunctions()}
          >
            Retry
          </button>
        </div>
      </>
    )
  }

  jobsloaderFunction = apistatusJobs => {
    switch (apistatusJobs) {
      case apistatusConstants.success:
        return this.successJobsView()
      case apistatusConstants.progress:
        return this.renderLoader()
      case apistatusConstants.failure:
        return this.failureJobsView()
      default:
        return null
    }
  }

  employementTypeChange = event => {
    const {employementType} = this.state

    const employementid = event.target.id

    console.log(employementType)
    if (employementType.includes(employementid)) {
      employementType.splice(employementType.indexOf(employementid), 1)
    } else {
      employementType.push(employementid)
    }
    this.setState({employementType})
    this.jobDetailsFunctions()
    // console.log(employementType)
  }

  salaryChange = event => {
    const {salaryRange} = this.state
    const salary = event.target.id
    if (salaryRange.length === 0) {
      salaryRange.push(salary)
    } else {
      salaryRange.pop(salary)
      salaryRange.push(salary)
    }
    this.setState({salaryRange})
    this.jobDetailsFunctions()
  }

  searchChange = event => {
    const {salaryRange} = this.state
    const salary = event.target.id
    if (salaryRange.length === 0) {
      salaryRange.push(salary)
    } else {
      salaryRange.pop(salary)
      salaryRange.push(salary)
    }
    this.setState({salaryRange})
    this.jobDetailsFunctions()
  }

  render() {
    const {
      apistatusProfile,
      apistatusJobs,
      employementType,
      salaryRange,
    } = this.state
    // console.log(`employemnet - ${employementType}`)
    // console.log(`salary Range - ${salaryRange}`)
    return (
      <>
        <Header />
        <div className="css-Header-jobs-page-whole-container">
          <div className="css-Header-jobs-page-left-side-container">
            {this.profileloaderFunction(apistatusProfile)}
            <hr />
            <h1 style={{color: 'white', fontWeight: '20px'}}>
              Type of Employment
            </h1>
            <ul className="css-Jobs-employementlist">
              {employmentTypesList.map(eachItem => (
                <li key={eachItem.label}>
                  <input
                    type="checkbox"
                    id={eachItem.employmentTypeId}
                    onChange={this.employementTypeChange}
                  />
                  <label htmlFor={eachItem.employmentTypeId}>
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 style={{color: 'white', fontWeight: '20px'}}>Salary Range</h1>
            <ul className="css-Jobs-salaryRange">
              {salaryRangesList.map(eachItem => (
                <li key={eachItem.label}>
                  <input
                    type="radio"
                    id={eachItem.salaryRangeId}
                    name="salaryRange"
                    onChange={this.salaryChange}
                  />
                  <label htmlFor={eachItem.salaryRangeId}>
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          {this.jobsloaderFunction(apistatusJobs)}
        </div>
      </>
    )
  }
}

export default Jobs

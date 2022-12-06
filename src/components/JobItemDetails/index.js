import './index.css'
import {Link} from 'react-router-dom'
import {BsBriefcaseFill} from 'react-icons/bs'
import {ImLocation} from 'react-icons/im'
import {FcRating} from 'react-icons/fc'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

const apistatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class jobItemDetails extends Component {
  state = {
    jobDetails: '',
    similarJobs: [],
    skills: [],
    apiJobDetailsStatus: apistatusConstants.initial,
  }

  componentDidMount() {
    this.apiFunctionCall()
  }

  renderLoader = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  apiFunctionCall = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiJobDetailsStatus: apistatusConstants.progress})
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    console.log(apiUrl)
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const jsonData = await response.json()
      const jobDetailsData = await jsonData.job_details
      console.log(jobDetailsData)
      //   console.log(jobDetailsData.skills)
      const jobDetails = {
        companyLogoUrl: jobDetailsData.company_logo_url,
        companyWebsiteUrl: jobDetailsData.company_website_url,
        employmentType: jobDetailsData.employment_type,
        id: jobDetailsData.id,
        description: jobDetailsData.life_at_company.description,
        lifeAtCompanyImageUrl: jobDetailsData.life_at_company.image_url,
        jobDescription: jobDetailsData.job_description,
        location: jobDetailsData.location,
        packagePerAnnum: jobDetailsData.package_per_annum,
        rating: jobDetailsData.rating,
        title: jobDetailsData.title,
      }
      console.log(jobDetails)
      const similarJobs = await jsonData.similar_jobs
      const skills = await jsonData.job_details.skills
      const skillDetails = skills.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))
      this.setState({
        jobDetails,
        similarJobs,
        skills: skillDetails,
        apiJobDetailsStatus: apistatusConstants.success,
      })
    } else {
      console.log('failure')
      this.setState({apiJobDetailsStatus: apistatusConstants.failure})
    }
  }

  successJobsView = () => {
    const {jobDetails, similarJobs, skills} = this.state
    return (
      <>
        <div className="css-jobItemDetails">
          <div className="css-Jobs-jobslist-div">
            <div className="css-Jobs-title-div">
              <div>
                <img
                  src={jobDetails.companyLogoUrl}
                  alt="job details company logo"
                  className="css-Jobs-logo"
                />
              </div>
              <div>
                <h1 style={{fontWeight: 'bold', fontSize: '20px'}}>
                  {jobDetails.title}
                </h1>
                <p style={{display: 'flex', alignItems: 'center'}}>
                  <FcRating />
                  {jobDetails.rating}
                </p>
              </div>
            </div>
            <div className="css-Jobs-location-salary-div">
              <div className="css-Jobs-location-div">
                <div className="css-Jobs-location-para">
                  <ImLocation />
                  <p>{jobDetails.location}</p>
                </div>
                <div className="css-Jobs-location-para">
                  <BsBriefcaseFill />
                  <p>{jobDetails.employmentType}</p>
                </div>
              </div>
              <p>{jobDetails.packagePerAnnum}</p>
            </div>
            <hr />
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h1>Description</h1>
              <Link
                to={{pathname: jobDetails.companyWebsiteUrl}}
                target="_blank"
              >
                Visit
              </Link>
            </div>
            <p>{jobDetails.jobDescription}</p>
            <h1>Skills</h1>

            <ul className="css-jobItemDetails-ul">
              {skills.map(eachSkill => (
                <li className="css-jobItemDetails-list" key={eachSkill.name}>
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="css-jobItemDetails-skills"
                  />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <div className="css-jobItemDetails-lifeatCompany">
              <div>
                <h1 style={{fontWeight: 'bold'}}>Life at Company</h1>
                <p>{jobDetails.description}</p>
              </div>
              <div>
                <img
                  src={jobDetails.lifeAtCompanyImageUrl}
                  alt="life at company"
                  style={{width: '150px', marginTop: '30px'}}
                />
              </div>
            </div>
          </div>
          <div>
            <h1 style={{color: 'white'}}>Similar Jobs</h1>
          </div>
          <ul className="css-jobitemDetails-ul-similarjobs">
            {similarJobs.map(jobItem => (
              <li className="css-Jobs-jobItemDetails-div" key={jobItem.id}>
                <div className="css-Jobs-title-div">
                  <div>
                    <img
                      src={jobItem.company_logo_url}
                      alt="similar job company logo"
                      className="css-Jobs-logo"
                    />
                  </div>
                  <div>
                    <h1 style={{fontWeight: 'bold', fontSize: '20px'}}>
                      {jobItem.title}
                    </h1>
                    <p style={{display: 'flex', alignItems: 'center'}}>
                      <FcRating />
                      {jobItem.rating}
                    </p>
                  </div>
                </div>
                <h1>Description</h1>
                <p>{jobItem.job_description}</p>
                <div className="css-Jobs-location-salary-div">
                  <div className="css-Jobs-location-div">
                    <div className="css-Jobs-location-para">
                      <ImLocation />
                      <p>{jobItem.location}</p>
                    </div>
                    <div className="css-Jobs-location-para">
                      <BsBriefcaseFill />
                      <p>{jobItem.employment_type}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
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
            onClick={this.apiFunctionCall}
          >
            Retry
          </button>
        </div>
      </>
    )
  }

  jobsDetailsloaderFunction = apiJobDetailsStatus => {
    switch (apiJobDetailsStatus) {
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

  render() {
    const {apiJobDetailsStatus} = this.state
    console.log(apiJobDetailsStatus)
    return (
      <>
        <Header />
        {this.jobsDetailsloaderFunction(apiJobDetailsStatus)}
      </>
    )
  }
}

export default jobItemDetails

import './index.css'
import {BsBriefcaseFill} from 'react-icons/bs'
import {ImLocation} from 'react-icons/im'
import {FcRating} from 'react-icons/fc'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'

class jobItemDetails extends Component {
  state = {jobDetails: '', similarJobs: [], skills: []}

  componentDidMount() {
    this.apiFunctionCall()
  }

  apiFunctionCall = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

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
      //   console.log(jsonData)
      //   console.log(jobDetailsData.skills)
      const jobDetails = {
        companyLogoUrl: jobDetailsData.company_logo_url,
        company_website_url: jobDetailsData.company_website_url,
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
      const similarJobs = await jsonData.similar_jobs
      const skills = await jsonData.job_details.skills
      const skillDetails = skills.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))
      this.setState({jobDetails, similarJobs, skills: skillDetails})
    }
  }

  render() {
    const {jobDetails, similarJobs, skills} = this.state

    console.log(similarJobs)

    return (
      <>
        <Header />
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
            <h1>Description</h1>
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
}

export default jobItemDetails

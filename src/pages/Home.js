import React, {Fragment, useContext} from "react";
import { AuthContext } from "../contexts/authContext"

import SignInButton from "../components/SignInButton"
import Navbar from "../components/layout/Navbar";


function Home() {
  
  const authContext = useContext(AuthContext);
  const showLogin = Object.keys(authContext.loggedInUser).length === 0

  const AUTH_END_POINT = process.env.REACT_APP_GOOGLE_OAUTH_END_POINT
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID
  const REDIRECT_URI = `${window.location.href}search`
  const STATE = process.env.REACT_APP_CSRF_STATE
  const SCOPE = "https://www.googleapis.com/auth/drive"

  const GOOGLE_AUTH_URL = `${AUTH_END_POINT}?scope=${SCOPE}&include_granted_scopes=true&response_type=token&state=${STATE}&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}`

  return (

    <Fragment>

     {showLogin && (
        <div className="container">
          <div className="hero">
            <h1>Searching past lab results made easy!</h1>
            <h3>We do not store your data.</h3>
          </div> 
          <SignInButton />
        </div>
      )}

      {!showLogin && (
        <Fragment>
          <Navbar />
          <div className="main_link" >
                <a href={GOOGLE_AUTH_URL}>Search</a>
                <a href="/upload">Upload</a>
          </div>
          
        </Fragment>

      )}
      </Fragment>
    )}

export default Home;

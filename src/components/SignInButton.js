import React from "react";
import { useNavigate} from "react-router-dom";
import {useEffect, useContext} from "react";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../contexts/authContext"

function SignInButton() {

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    function handleCallbackResponse(response){
        let user = jwt_decode(response.credential)
        authContext.setLoggedInUser({ ...user});
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ ...user})
        );
    
        navigate("/");

    }

    useEffect(()=>{
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
          callback: handleCallbackResponse
        });
  
        window.google.accounts.id.renderButton(
          document.getElementById("signInDiv"),{
            theme: "outline",
            size: "large"
          }
        )
  
  
    },[] )


    return (
        <div id="signInDiv"></div>
    );
}

export default SignInButton;

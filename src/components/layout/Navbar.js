import { useContext } from "react";
import { useNavigate} from "react-router-dom";
import { AuthContext } from "../../contexts/authContext"

import "./Navbar.css"

const Navbar = () => {

    const navigate = useNavigate();

    const onLogoutlHandler = () => {
        localStorage.removeItem('loggedInUser');
        authContext.setLoggedInUser({})
        navigate("/")
    }

    const authContext = useContext(AuthContext);

    if(Object.keys(authContext.loggedInUser).length === 0 ) {
        navigate("/")
    }

    return(
        <div className="navbar">
            <div className="navbar_logo">logo</div>
            <div className="navbar_primary-links">
                {/**<p>Search</p>**/}
                {/**  <p className="navbar_primary-links_2">Upload</p> */}
            </div>
            <div className="navbar_secondary-links">
                <p>Hi, {authContext.loggedInUser.given_name}</p>
                <button onClick={onLogoutlHandler}>Logout</button>
            </div>

        </div>
    )

}

export default Navbar;
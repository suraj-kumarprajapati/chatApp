import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Header = () => {
    const {user} = useSelector(state => state.userReducer);
    const navigate = useNavigate();


    const getFullName = () => {
        const fName = user?.firstName.toUpperCase();
        const lName = user?.lastName.toUpperCase();
        return fName + " " + lName;
    }

    const getInitials = () => {
        const f = user?.firstName.toUpperCase().charAt(0);
        const l = user?.lastName.toUpperCase().charAt(0);
        return f+l;
    }

    return (
        <>
            <div className="app-header">
                <div className="app-logo">
                    <i className="fa fa-comments" aria-hidden="true"></i>
                    VibeChat
                </div>
                <div className="app-user-profile">
                    <div className="logged-user-name">
                        {getFullName()}
                    </div>

                    {user?.profilePic && <img alt="profile-pic" src={user?.profilePic} className="logged-user-profile-pic"   onClick={() => navigate('/profile')}></img>}

                    {   !user?.profilePic && 
                        <div className="logged-user-profile-pic" onClick={() => navigate('/profile')} >    
                            {getInitials()}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}


export default Header;

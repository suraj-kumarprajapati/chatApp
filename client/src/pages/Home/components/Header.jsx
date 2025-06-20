import { useSelector } from "react-redux";


const Header = () => {
    const {user} = useSelector(state => state.userReducer);


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
                    <div className="logged-user-profile-pic">    
                        {getInitials()}
                    </div>
                </div>
            </div>
        </>
    )
}


export default Header;

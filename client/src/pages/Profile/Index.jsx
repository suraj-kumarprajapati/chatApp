import moment from "moment";
import { useSelector } from "react-redux";
import { useState } from "react";




const Profile = () => {

    const {user} = useSelector(state => state.userReducer);
    const [profileImage, setProfileImage] = useState(user?.profilePic || '');


    
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

    const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
            setProfileImage(reader.result);
        }
    }

    return (
        <>
            <div className="profile-page-container">
                <div className="profile-pic-container">
                    {
                        profileImage && 
                        <img src={profileImage}
                            alt="Profile Pic"
                            className="user-profile-pic-upload"
                        /> 
                    }
                    {
                        !profileImage && 
                        <div className="user-default-profile-avatar">
                            {getInitials()}
                        </div>
                    }
                    
                </div>

                <div className="profile-info-container">
                    <div className="user-profile-name">
                        <h1>{getFullName()}</h1>
                    </div>
                    <div>
                        <b>Email: </b> {user?.email}
                    </div>
                    <div>
                        <b>Account Created: </b> {moment(user.createdAt).format("MMM YY, DD")}
                    </div>
                    <div className="select-profile-pic-container"   onChange={ handleImageUpload }>
                        <input type="file" />
                    </div>
                </div>
            </div>

        </>
    )
}





export default Profile;

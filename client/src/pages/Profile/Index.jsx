import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {uploadProfilePic} from "../../apiCalls/users.js";
import { setUser } from "../../redux/userSlice.js";
import toast from 'react-hot-toast';



const Profile = () => {

    const {user} = useSelector(state => state.userReducer);
    const [profileImage, setProfileImage] = useState(user?.profilePic || '');
    const dispatch = useDispatch();


    
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

    // converts the image to base64 and set it to profileImage
    const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];

        if(!imageFile)
            return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            setProfileImage(reader.result);
        }

        reader.readAsDataURL(imageFile);
    }

    // upload user profile
    const uplaodProfile = async () => {
        try {
            console.log(profileImage);
            const response = await uploadProfilePic(profileImage);

            if(response.success) {
                const updatedUserData = response.data;
                toast.success(response.message);
                dispatch(setUser(updatedUserData));
            }
            else {
                toast.error(response.message);
            }
        }
        catch (error) {
            toast.error(error.message);
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
                    <div>
                        <button onClick={uplaodProfile}>
                            Upload
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}





export default Profile;

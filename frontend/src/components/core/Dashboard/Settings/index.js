import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";

export default function Settings(){
    return (<>
        <h1 className=" text-3xl font-medium text-richblack-5">
            Edit Profile
        </h1>
        {/* Change Profile Picture */}
        <ChangeProfilePicture/>
        {/* Profile */}
        <EditProfile/>
        {/* Update password */}
        <UpdatePassword/>
        {/* Delete Account */}
        <DeleteAccount/>
    </>)
}
import { useState } from "react";
import Search from "./Search";
import UsersList from "./UsersList";


const Sidebar = ({socket}) => {

    const [searchKey, setSearchKey] = useState('');


    return (
        <>
            <div className="app-sidebar">
                {/* <!--SEARCH USER--> */}
                <Search searchKey={searchKey}  setSearchKey={setSearchKey} />

                {/* <!--USER LIST--> */}
                <UsersList  searchKey={searchKey}  socket={socket} />
            </div>
        </>
    )
}



export default Sidebar;
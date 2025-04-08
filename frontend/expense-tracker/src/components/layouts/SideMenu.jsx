import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';


const SideMenu = ({activeMenu}) => {
    const {user, clearUser} = useContext(UserContext);

    const navigate = useNavigate();

    const handleClick = (route) => {
        if (route == "logout"){
            handleLogout();
            return;
        }

        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };
    return (
        <div className=''>
            <div>
                {user.profileImageUrl ?  (
                    <img 
                        src={user?.profileImageUrl || ""} 
                        alt="Profile Image" 
                        className=""
                    />) : <></>}

                <h5 className=''>
                    {user?.fullName || ""}
                </h5>
            </div>

            {SIDE_MENU_DATA.map((item, index) => {
                <button
                    key={`menu_${index}`}
                    className={`w-full flex items-center gap-4 text-[15px] ${
                        activeMenu == item.label ? "text-white bg-primary": ""
                    } py-3 px-6 rounded-lg mb-3`}
                    onClick={() => handleClick(item.path)}
                >
                        <item.icon className=''/>
                        {item.label}
                </button>
                        

            )}

        </div>;
};

export default SideMenu;
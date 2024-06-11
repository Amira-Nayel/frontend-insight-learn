/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link, useLocation  } from 'react-router-dom';


const Sidebar = (props) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation();
    const is_staff = localStorage.getItem('is_staff');
    const is_superuser = localStorage.getItem('is_superuser');
    const [ toggleNotifications, setToggleNotifications ] = useState(false);
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        // Fetch the predictions data from the API
        fetch('https://dj-render-ldb1.onrender.com/successprediction')
            .then((response) => response.json())
            .then((data) => {
                setPredictions(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);
    // get only failed predictions
    const failedPredictions = predictions.filter(prediction => prediction.predictions === 0); 



    useEffect(() => {
        {location.pathname.startsWith("/dashboard/add-user" || "/dashboard/users-data")  && setShowDropdown(true)}
    }, [])

    // Group failed predictions by course
    const groupedPredictions = failedPredictions.reduce((groups, prediction) => {
        if (!groups[prediction.Course]) {
        groups[prediction.Course] = [];
        }
        groups[prediction.Course].push(prediction);
        return groups;
    }, {});

    return (
        <div className={props.showSideBar ? window.innerWidth > 768 ? "relative w-[250px]" : "relative w-[100%]" : "relative w-[50px]"}>
            <div className="bg-c_3 text-white h-[100dvh] flex flex-col items-center justify-between py-3">
                <div className=' overflow-auto'>
                    <div>
                        {props.showSideBar ? (
                            <ul className='text-xl flex flex-col gap-2 max-sm:w-screen w-full'>
                                <li>
                                    <Link to="/">
                                        <img 
                                            src="/images/logo.png" alt="logo" className={props.showSideBar ? window.innerWidth > 768 ? "px-10 py-5 w-[100%] min-w-[70px]" : "px-10 py-5 w-[20%] min-w-[70px]" : "px-10 py-5 w-[100%] min-w-[70px]"} 
                                            onClick={() => props.toggleSideBar()}
                                        />
                                    </Link>
                                </li>
                                { (is_staff === "true" || is_superuser === "true") && (
                                    <li>
                                        <Link 
                                            className={`flex gap-3 items-center p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/maindash" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/maindash"
                                            onClick={() => props.toggleSideBar()}
                                        >
                                            <img className='w-8' src="/images/dashboard.png" alt="dashboard icon" />
                                            Dashboard
                                        </Link>
                                    </li>
                                )}
                                {is_staff === "true" && (
                                    <>
                                        <li>
                                            <Link 
                                                className={`flex gap-3 items-center p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/reports" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/reports"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-8' src="/images/reportsicon.png" alt="reports icon" />
                                                Reports
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className={`flex gap-3 items-center p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/predictions" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/predictions"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-8' src="/images/predictionsicon.png" alt="predictions icon" />
                                                Predictions
                                            </Link>
                                        </li>
                                    </>
                                )}
                                { (is_superuser === "true") && (
                                    <li
                                        onMouseEnter={() => setShowDropdown(true)}
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <Link 
                                            className={`flex gap-3 items-center justify-between p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname.startsWith("/dashboard/users") ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/users"
                                            onClick={() => props.toggleSideBar()}
                                        >
                                            <div className='flex justify-center items-center gap-3'>
                                            <img className='w-8' src="/images/users.png" alt="users icon" />
                                            Users
                                            </div>
                                            <img className='w-6 flex self-end' src="/images/downarrow.png" alt="downarrow" />
                                        </Link>
                                        {showDropdown && (
                                            <ul className="flex flex-col pl-5 gap-2">
                                                <li>
                                                    <Link 
                                                        className={`flex gap-3 items-center justify-start p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname.startsWith("/dashboard/users-data") ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/users-data"
                                                        onClick={() => props.toggleSideBar()}
                                                    >
                                                        <img className='w-8' src="/images/user-data.png" alt="users icon" />User Data
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link 
                                                        className={`flex gap-3 items-center justify-start p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname.startsWith("/dashboard/add-user") ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/add-user"
                                                        onClick={() => props.toggleSideBar()}
                                                    >
                                                        <img className='w-8' src="/images/add-user.png" alt="users icon" />
                                                        Add User
                                                    </Link>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                    
                                )}
                                {is_staff === "true" && (
                                    <>
                                        <li>
                                            <Link 
                                                className={`flex gap-3 items-center p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/sessions" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/sessions"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-8' src="/images/sessions.png" alt="sessions icon" />
                                                Sessions
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className={`flex gap-3 items-center p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/courses" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/courses"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-8' src="/images/courses.png" alt="courses icon" />
                                                Courses
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {(is_superuser === "false" && is_staff === "false") && (
                                    <>
                                        <li>
                                            <Link 
                                                className={`flex gap-3 items-center p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/studentdash" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/studentdash"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-8' src="/images/dashboard.png" alt="dashboard icon" />
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className={`flex gap-3 items-center p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/personal-report" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/personal-report"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-8' src="/images/eye.png" alt="sessions icon" />
                                                Attention Report
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className={`flex gap-3 items-center p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/personal-predictions" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/personal-predictions"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-8' src="/images/predictionsicon.png" alt="predictionsicon icon" />
                                                Predictions
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className={`flex gap-3 items-center p-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/reportcard" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/reportcard"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-8' src="/images/reportcard.png" alt="predictionsicon icon" />
                                                Report Card
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        ) : (
                            <ul className='text-xl flex flex-col gap-3'>
                                <li>
                                    <Link to="/">
                                        <img 
                                            src="/images/logo.png" alt="logo" 
                                            className={props.showSideBar ? window.innerWidth > 768 ? "px-10 py-5 w-[100%] min-w-[50px]" : "px-10 py-5 w-[50%] min-w-[50px]" : "px-2 py-2 w-[50%] min-w-[50px]"} 
                                            onClick={() => props.toggleSideBar()}
                                        />
                                    </Link>
                                </li>
                                { (is_staff === "true" || is_superuser === "true") && (
                                    <>
                                        <li>
                                            <Link 
                                                className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/maindash" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/maindash"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-10' src="/images/dashboard.png" alt="reports icon" />
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {is_staff === "true" && (
                                    <>
                                        <li>
                                            <Link 
                                                className={`flex px-3 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/reports" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/reports"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-10' src="/images/reportsicon.png" alt="reports icon" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/predictions" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/predictions"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-10' src="/images/predictionsicon.png" alt="predictions icon" />
                                            </Link>
                                        </li>
                                    </>
                                )}
                                
                                { (is_superuser === "true") && (
                                    <>
                                        <li
                                            onMouseEnter={() => setShowDropdown(true)}
                                            onMouseLeave={() => setShowDropdown(false)}
                                        >
                                            <Link 
                                                className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/users" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/users"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <div className='flex flex-col justify-center items-center gap-1'>
                                                    <img className='w-10' src="/images/users.png" alt="users icon" />
                                                    <img className='w-3' src="/images/downarrow.png" alt="downarrow icon" />
                                                </div>
                                            </Link>
                                            {showDropdown && (
                                                <ul className="flex flex-col gap-2">
                                                    <li>
                                                        <Link 
                                                            className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/users-data" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/users-data"
                                                            onClick={() => props.toggleSideBar()}
                                                        >
                                                            <img className='w-10' src="/images/user-data.png" alt="user data icon" />
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link 
                                                            className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/add-user" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/add-user"
                                                            onClick={() => props.toggleSideBar()}
                                                        >
                                                            <img className='w-10' src="/images/add-user.png" alt="users icon" />
                                                        </Link>
                                                    </li>
                                                </ul>
                                            )}
                                            
                                        </li>
                                    </>
                                )}
                                {is_staff === "true" && (
                                    <>
                                        <li>
                                            <Link 
                                                className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/sessions" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/sessions"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-10' src="/images/sessions.png" alt="sessions icon" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/courses" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/courses"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-10' src="/images/courses.png" alt="courses icon" />
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {(is_superuser === "false" && is_staff === "false") && (
                                    <>
                                        <li>
                                            <Link 
                                                className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/studentdash" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/studentdash"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-10' src="/images/dashboard.png" alt="dashboard icon" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/personal-report" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/personal-report"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-10' src="/images/eye.png" alt="sessions icon" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/personal-predictions" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/personal-predictions"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-10' src="/images/predictionsicon.png" alt="sessions icon" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className={`flex px-2 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/reportcard" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/reportcard"
                                                onClick={() => props.toggleSideBar()}
                                            >
                                                <img className='w-10' src="/images/reportcard.png" alt="sessions icon" />
                                            </Link>
                                        </li>
                                    </>
                                )}
                                
                            </ul>
                        )}
                    </div>
                </div>
                <div className='w-full flex flex-col gap-3 pb-3 justify-center'>
                    <div className='w-[80%] h-0.5 self-center bg-c_5'></div>
                    {props.showSideBar ? 
                        <div className='flex flex-col gap-3'>
                            <Link 
                                className={`flex p-2 px-2 gap-2 items-center text-xl cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/profile" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/profile"
                                onClick={() => props.toggleSideBar()}
                            >
                                <img className='w-8' src="/images/profile.png" alt="profile icon" />
                                Profile
                            </Link>
                        </div>
                    :
                        <div className='flex flex-col gap-2'>
                            <Link 
                                className={`flex p-3 py-2 cursor-pointer transition-all duration-150 ease-in ${location.pathname === "/dashboard/profile" ? 'bg-c_5 bg-opacity-15' : 'hover:bg-c_5 hover:bg-opacity-15'}`} to="/dashboard/profile"
                                onClick={() => props.toggleSideBar()}
                            >
                                <img className='w-12' src="/images/profile.png" alt="profile icon" />
                            </Link>
                        </div>
                    }
                    <button 
                        onClick={() => props.toggleSideBar()}
                        className='pl-2 w-[40px] self-center  bg-opacity-10 hover:bg-opacity-25 hover:bg-white transition-all duration-200 rounded-2xl text-white'
                    >
                        {props.showSideBar ?
                            <img className='w-5' src="/images/leftarrow.png" alt="leftarrow" />
                            :
                            <img className='w-5' src="/images/rightarrow.png" alt="rightarrow" />
                        }
                    </button>
                    <button 
                        onClick={() => setToggleNotifications(!toggleNotifications)} 
                        className='pl-2 w-[40px] self-center  bg-opacity-10 hover:bg-opacity-25 hover:bg-white transition-all duration-200 rounded-2xl text-white'
                    >
                        {toggleNotifications ?
                            <img className='w-5 hover:animate-pulse' src="/images/bell-on.png" alt="bell" />
                            :
                            <img className='w-5 hover:animate-pulse' src="/images/bell.png" alt="bell-off" />
                        }

                    </button>
                    <button 
                        onClick={() => props.setIsDarkMode(!props.isDarkMode)} 
                        className='pl-2 w-[40px] self-center dark bg-opacity-10 hover:bg-opacity-25 hover:bg-white transition-all duration-200 rounded-2xl text-white'
                    >
                        {props.isDarkMode ?
                            <img className='w-5' src="/images/moon.png" alt="leftarrow" />
                            :
                            <img className='w-5' src="/images/sun.png" alt="rightarrow" />
                        }
                    </button>
                    
                </div>
            </div>
            <div>
                {toggleNotifications && (
                    <div  className={props.showSideBar  ? 'absolute bottom-0 left-0 translate-x-[64%] p-5 bg-c_5 dark:bg-black dark:bg-opacity-70 dark:text-white w-[400px] h-[40dvh] overflow-auto  transition-all ease-in-out duration-200' : 'absolute bottom-0 left-0 translate-x-[55px] bg-c_5 border dark:bg-black dark:bg-opacity-70 dark:text-white w-[400px] h-[40dvh] overflow-auto  transition-all ease-in-out duration-200' }>
                        <div className='flex justify-between items-center p-3'>
                            {failedPredictions.length > 0 ? (
                                <h1 className='text-xl text-[red]'>Notifications</h1>
                            ) : (
                                <h1 className='text-xl'>Notifications</h1>
                            )
                            }
                            <button onClick={() => setToggleNotifications(false)} className='text-xl'>X</button>
                        </div>
                        <div className="flex flex-col gap-3 p-5">
                            <div className="d-flex flex-wrap justify-content-start">
                                {failedPredictions.length === 0 && <p>No New Notifications</p>}
                                {failedPredictions.length > 0 && <h2 className='text-lg'>{failedPredictions.length} Students Predicted To Fail</h2>}
                                
                                {Object.entries(groupedPredictions).map(([course, predictions], index) => (
                                    <div key={index} className="card p-1">
                                    <div className="flex flex-col border border-c_4 p-2">
                                        <h5 className="p-3 self-center">{course}</h5>
                                        <div className='flex flex-col justify-center items-start px-5 gap-2'>
                                            {predictions.map((prediction, index) => (
                                                <p key={index}>{prediction.email}</p>
                                            ))}
                                        </div>
                                    </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar;

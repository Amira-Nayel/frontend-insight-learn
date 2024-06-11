/* eslint-disable react/prop-types */
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useEffect, useState, useRef} from 'react';

const Dashboard = (props) => {
    const [showSideBar, setShowSideBar ] = useState('true');

    const sidebarRef = useRef(null);

    const toggleSideBar = () => {
        setShowSideBar(!showSideBar);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setShowSideBar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setShowSideBar(window.innerWidth > 768);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className=" flex dark:bg-[#222831] h-[100dvh] overflow-hidden">
                <div>
                        { showSideBar ? 
                            <div>
                                { window.innerWidth < 768 ? 
                                    <div>
                                        <div ref={sidebarRef} className='w-screen'>
                                            <Sidebar 
                                                showSideBar={showSideBar}
                                                toggleSideBar={toggleSideBar}
                                                setIsDarkMode={props.setIsDarkMode}
                                                isDarkMode={props.isDarkMode}
                                            />
                                        </div>
                                        <div className="flex p-5 justify-center items-center dark:bg-grey text-black overflow-x-scroll">
                                            <Outlet/>
                                        </div>
                                    </div>
                                :
                                    <div className='flex w-screen  items-center'>
                                        <div ref={sidebarRef} className=' justify-start'>
                                                <Sidebar 
                                                    showSideBar={showSideBar}
                                                    toggleSideBar={toggleSideBar}
                                                    setIsDarkMode={props.setIsDarkMode}
                                                    isDarkMode={props.isDarkMode}
                                                />
                                        </div>
                                        <div className="flex w-full p-5 justify-center items-center dark:bg-grey text-black">
                                                <Outlet/>
                                        </div>
                                    </div>
                                }
                            </div>
                        : 
                            <div>   
                                { window.innerWidth < 768 ? 
                                    <div className='flex'>
                                        <div ref={sidebarRef} className=''>
                                                <Sidebar 
                                                    showSideBar={showSideBar}
                                                    toggleSideBar={toggleSideBar}
                                                    setIsDarkMode={props.setIsDarkMode}
                                                    isDarkMode={props.isDarkMode}
                                                />
                                        </div>
                                        <div className="w-[90vw] p-5 flex justify-center items-center dark:bg-grey text-black">
                                                <Outlet/>
                                        </div>
                                    </div>

                                :

                                    <div className='flex'>
                                        <div ref={sidebarRef} className=''>
                                                <Sidebar 
                                                    showSideBar={showSideBar}
                                                    toggleSideBar={toggleSideBar}
                                                    setIsDarkMode={props.setIsDarkMode}
                                                    isDarkMode={props.isDarkMode}
                                                />
                                        </div>
                                        <div className="w-[90vw] p-5 flex justify-center items-center dark:bg-grey text-black">
                                                <Outlet/>
                                        </div>
                                    </div>

                                }
                            </div>
                        }
                </div>
            
        </div>
    );
}

export default Dashboard;
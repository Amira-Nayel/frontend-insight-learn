/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useExternalScript } from "../helpers/ai-sdk/externalScriptsLoader";
import { getAiSdkControls } from "../helpers/ai-sdk/loader";
import Session from "../components/Session";
import Navbar from '../components/Navbar';
import Volume from "../components/Volume";
import DominantEmotionComponent from "../components/morphcomponents/DominantEmotionComponent";
import EngagementComponent from "../components/morphcomponents/EngagementComponent";
import FaceTrackerComponent from "../components/morphcomponents/FaceTrackerComponent";

const Home = () => {
    const videoEl = useRef(undefined);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [userData, setUserData] = useState({
        userEmail:'',
        dominantEmotion: 'Neutral',
        arousal: 0,
        valence: 0,
        attention: 0,
        volume: 0,
        SessionStartedAt: '',
        CaptureTime: '',
        Session_for:'SA-quiz',
    });
    const [userDataChanged, setUserDataChanged] = useState(false);
    const [isSendingData, setIsSendingData] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const username = localStorage.getItem("username");
    const is_superuser = localStorage.getItem("is_superuser");
    const is_staff = localStorage.getItem("is_staff");

    // Load external scripts
    const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
    const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");

    // Check login status on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setUserData(prevUserData => ({...prevUserData, userEmail: localStorage.email}));
        } else {
            window.location.href = '/login';
        }
    }, []);

    // Logout handler
    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
        };

        const response = await fetch('https://dj-render-ldb1.onrender.com/logout/', requestOptions);

        if (response.ok) {
            localStorage.clear();
            setIsLoggedIn(false);
            window.location.href = '/login';
        } else {
            console.error('Logout failed');
        }
    };

    // Remove overlay controls from video in Edge
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            const observer = new MutationObserver(() => {
                const overlayControls = videoElement.shadowRoot.querySelector('::-webkit-media-controls-overlay-enclosure');
                if (overlayControls) {
                    overlayControls.style.display = 'none';
                }
            });

            observer.observe(videoElement, { childList: true, subtree: true });

            return () => {
                observer.disconnect();
            };
        }
    }, []);

    // Session start handler
    const handleSessionStart = () => {
        try {
            setSessionStarted(true);
            const currentTime = new Date().toLocaleTimeString([], { hour12: false });
            setUserData(prevUserData => ({
                ...prevUserData,
                SessionEndedAt: '',
                CaptureTime: currentTime,
                SessionStartedAt: currentTime
            }));
            window.open('http://insightlearn.me/', '_blank');
        } catch (error) {
            console.error("Error starting session:", error);
        }
    };

    // Session end handler
    const handleSessionEnd = async () => {
        try {
            const currentTime = new Date().toLocaleTimeString([], { hour12: false });

            // Update session and user data
            setSessionStarted(false);
            const updatedUserData = { ...userData, SessionEndedAt: currentTime, CaptureTime: currentTime };
            setUserData(updatedUserData);

            // Save user data to API
            const response = await fetch('https://dj-render-ldb1.onrender.com/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Data sent successfully
            console.log("Final Data sent to API successfully");
            setUserDataChanged(false);
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
        } finally {
            setUserData(prevUserData => ({ ...prevUserData, SessionEndedAt: "" }));
            setSessionStarted(false);
        }
    };

    // Sending data to Django API
    let timeoutId = null;
    async function sendDataToAPI() {
        if (userDataChanged && sessionStarted && !isSendingData) {
            setIsSendingData(true);
            setUserData(prevUserData => ({ ...prevUserData, CaptureTime: new Date().toLocaleTimeString([], { hour12: false }) }));
            try {
                const response = await fetch('https://dj-render-ldb1.onrender.com/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {console.log("Data sent to API successfully");console.log(userData);
                    setUserDataChanged(false);
                } else {
                    console.error("Failed to send data to API:", response.status);
                    console.log(userData);
                }
            } catch (error) {
                console.error("Error sending data:", error);
            } finally {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(() => {
                    setIsSendingData(false);
                }, 15000);
            }
        }
    }

    // Use useEffect to trigger sendDataToAPI when userData changes
    useEffect(() => {
        if (sessionStarted) sendDataToAPI();
    }, [sessionStarted, userData, userDataChanged]);

    // AI SDK setup effect
    useEffect(() => {
        videoEl.current = document.getElementById("videoEl");
        async function getAiSdk() {
            if (aiSdkState === "ready" && mphToolsState === "ready") {
                const { source, start } = await getAiSdkControls();
                await source.useCamera({
                    toVideoElement: document.getElementById("videoEl"),
                });
                await start();
            }
        }
        getAiSdk();
    }, [aiSdkState, mphToolsState]);

    const handlePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        } else if (videoRef.current.mozRequestFullScreen) {
            videoRef.current.mozRequestFullScreen();
        } else if (videoRef.current.webkitRequestFullscreen) {
            videoRef.current.webkitRequestFullscreen();
        } else if (videoRef.current.msRequestFullscreen) {
            videoRef.current.msRequestFullscreen();
        }
    };

    return (
        <div className="flex flex-col w-full">
            <Navbar
                isLoggedIn={isLoggedIn} 
                userEmail={userData.userEmail} 
                handleLogout={handleLogout} 
            />
            <div className="h-screen">
                <iframe className='h-full w-full' src="/header.html" title="Header" />
            </div>
            <div className="flex flex-col justify-center items-center bg-c_1 text-white">
                <div className="relative">
                    <FaceTrackerComponent videoEl={videoEl}></FaceTrackerComponent>
                </div>
                <div>
                    <DominantEmotionComponent
                        userData={userData}
                        setUserData={setUserData}
                        setUserDataChanged={setUserDataChanged}
                    ></DominantEmotionComponent>
                    <Volume
                        userData={userData}
                        setUserData={setUserData}
                        setUserDataChanged={setUserDataChanged}
                    ></Volume>
                    <EngagementComponent
                        userData={userData}
                        setUserData={setUserData}
                        setUserDataChanged={setUserDataChanged}
                    ></EngagementComponent>
                </div>
            </div>
            
            { is_staff === 'true' || is_superuser === 'true' ? (
                <div className="flex flex-col p-5 gap-5">
                    <h1 className="text-center text-3xl text-c_1">Welcome {username}</h1>
                    <div className="flex flex-col justify-center items-center flex-wrap md:flex-nowrap gap-5">
                        <div className="flex flex-col relative justify-center items-center ">
                            <video  
                                ref={videoRef} 
                                src="/dashboardguide.mp4" 
                                muted 
                                loop 
                                preload="auto"
                                disablePictureInPicture 
                                controlsList="nodownload noremoteplayback"
                            ></video>
                            {!isPlaying ? (
                                <>
                                    <div className="absolute px-[200px] py-[100px] opacity-0 hover:opacity-100 transition-all duration-200 ease-linear">
                                        <button onClick={handlePlayPause} className="bg-transparent w-10 text-white bg-[grey] bg-opacity-50 hover:bg-[grey] transition-all duration-200 ease-in"><img  src="/images/start.png" alt="start icon" /></button>
                                    </div>
                                    <div className="absolute bottom-0 right-2 transition-all duration-200 ease-linear">
                                        <button onClick={handleFullscreen} className="bg-transparent bg-opacity-50 hover:bg-[grey] transition-all duration-200 ease-in"><img className="w-8" src="/images/fullscreen.png" alt="fullscreen icon" /></button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="absolute px-[200px] py-[100px] opacity-0 hover:opacity-50 transition-all duration-200 ease-linear">
                                        <button onClick={handlePlayPause} className="text-white w-10 hover:bg-[grey] hover:opacity-100 transition-all duration-200 ease-in"><img src="/images/pause.png" alt="pause icon" /></button>
                                    </div>
                                    <div className="absolute bottom-0 right-2 transition-all duration-200 ease-linear">
                                        <button onClick={handleFullscreen} className="bg-transparent bg-opacity-50 hover:bg-[grey] transition-all duration-200 ease-in"><img className="w-8" src="/images/fullscreen.png" alt="fullscreen icon" /></button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col gap-5 bg-c_5 p-5 justify-center items-center">
                            <h2 className="text-center text-xl text-c_1">Access Your Dashboard And Gain Insights About Your Students</h2>
                            <a href="/dashboard/maindash" className="bg-transparent text-black border-2 hover:bg-black hover:text-white transition-all duration-200 ease-in px-3 py-1 rounded-3xl">Dashboard</a>
                        </div>
                    </div>
                </div>
            ) : (
                <Session 
                    handleSessionStart={handleSessionStart}
                    handleSessionEnd={handleSessionEnd}
                    sessionStarted={sessionStarted}
                    userEmail={userData.userEmail}
                    username={username}
                />
            )}
            
            <div className="h-[260px] max-md:h-[360px] max-sm:h-[350px] w-full flex bg-c_1">
                <iframe className="w-full" src="/footer.html" title="Footer" />
            </div>
        </div>
    );
};

export default Home;

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const AboutUs = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if token exists in local storage
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            window.location.href = '/login';
        }
    }, []);

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
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('username');
            localStorage.removeItem('is_active');
            localStorage.removeItem('is_staff');
            localStorage.removeItem('is_superuser');
            
            setIsLoggedIn(false);
            window.location.href = '/login';
        } else {
            // Handle error
            console.error('Logout failed');
        }
    };


    return (
        <div className="flex overflow-hidden flex-col">
            <div className="h-[15dvh]">
                <Navbar
                        isLoggedIn={isLoggedIn} 
                        handleLogout={handleLogout} 
                />
            </div>
            
            <div className="h-[85dvh] max w-full flex bg-c_1">
                <iframe className="w-full" src="/about-us.html" title="About Us" />
            </div>
        </div>
    )
}

export default AboutUs
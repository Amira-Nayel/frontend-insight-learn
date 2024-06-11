import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Signup = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage(''); // Clear any previous error message

        // Validation
        if (!username.trim()) {
            setErrorMessage("Username is required");
            setIsLoading(false);
            return;
        }

        if (!email.trim()) {
            setErrorMessage("Email is required");
            setIsLoading(false);
            return;
        }

        if (!password.trim() || password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            setIsLoading(false);
            return;
        }


        try {
            const response = await fetch('https://dj-render-ldb1.onrender.com/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                // Handle successful signup here
                window.location.href = '/login';
            } else {
                // Handle error here
                setErrorMessage(data.username || 'An error occurred');
                setIsLoading(false);
            }
        } catch (error) {
            setErrorMessage(error.error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col self-center items-center py-[150px]">
                <Navbar />
                <h2 className="text-c_3">Already have an account? <span className="">
                <Link className="hover:text-c_3 text-c_4 transition-all ease-in duration-200" to="/login">Login</Link>
                    </span></h2>
                <div className="flex flex-col justify-center w-fit self-center bg-c_1 mt-5 text-white items-center border-[1px] border-white p-5">
                    <img className="w-[120px]" src="/images/login-profile.png" alt="" />
                    <form className='flex flex-col gap-5 p-5' onSubmit={handleSubmit}>
                        <div className="flex justify-between w-full text-c_3">
                            <img className="w-[50px]" src="images/user-icon.jpeg" alt="user icon" />
                            <input
                                className='w-[90%] h-13 bg-c_5 p-2 border-none'
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="User Name"
                                required
                            />
                        </div>
                        <div className="flex justify-between w-full text-c_3">
                            <input
                                className='w-[90%] h-13 bg-c_5 p-2 border-none'
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="University Student Email"
                                required
                            />
                            <img className="w-[50px] p-3 bg-white" src="images/email-icon.png" alt="email icon" />
                        </div>
                        <div className="flex relative justify-between w-full text-c_3">
                            <img className="w-[50px]" src="/images/lock-icon.jpeg" alt="lock icon" />
                            <input
                                className='w-[90%] relative h-13 bg-c_5 pr-12 p-2 border-none'
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                            <button className="absolute top-4 right-4" type="button" onClick={() => setShowPassword(!showPassword)}>
                                <div className='w-5'>
                                    {showPassword ? 
                                        <img src="/images/open-eye.png" alt="" />
                                    : 
                                        <img src="/images/closed-eye.png" alt="" />
                                    }
                                </div>
                            </button>
                        </div>
                        <div className="flex relative justify-between w-full text-c_3">
                            <input
                                className='w-[90%] h-13 bg-c_5 p-2 border-none'
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                            />
                            <button className="absolute top-4 right-16" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <div className='w-5'>
                                {showConfirmPassword ? 
                                    <img src="/images/open-eye.png" alt="" />
                                : 
                                    <img src="/images/closed-eye.png" alt="" />
                                }
                            </div>
                        </button>
                            <img className="w-[50px]" src="/images/lock-icon.jpeg" alt="lock icon" />
                        </div>
                        <div className='w-full'>
                            {errorMessage && <p className='bg-opacity-5 text-center font-bold text-[#930505] text-md'>{errorMessage}</p>}
                        </div>
                        <button 
                            className="bg-c_5 p-2 hover:bg-opacity-[30%] text-c_3 hover:text-c_5 border-2 border-c_3 transition-all duration-200 ease-in"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            type="submit">
                                {isLoading ? (
                                    <span className="">Loading...</span>
                                ) : (
                                    'Sign Up'
                                )}
                        </button>
                    </form>
                </div>
                <a className="hover:text-c_3 text-c_4 transition-all ease-in duration-200" href="https://auth-new.onrender.com/reset_password/">Forgot Password ?</a>
            </div>
        </div>
    );
};

export default Signup;
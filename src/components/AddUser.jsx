import { useState } from 'react';

function AddUser() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        if(event.target.name === 'email') {
            setEmail(event.target.value);
        } else if (event.target.name === 'password') {
            setPassword(event.target.value);
        }else {
            setUsername(event.target.value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Input validation
        if (!username || !email || !password) {
            setErrorMessage('All fields are required');
            return;
        }

        if (!email.includes('@')) {
            setErrorMessage('Please enter a valid email');
            return;
        }

        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);
    
        fetch('https://dj-render-ldb1.onrender.com/add_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setUsername('');
            setEmail('');
            setPassword('');
            setIsLoading(false);
        })
        .catch((error) => {
            setErrorMessage('An error occurred while adding the user', error);
            setIsLoading(false);
        });
    };

    return (
            <div className="flex flex-col shadow-md justify-center w-fit self-center bg-c_1 mt-5 text-white items-center border-[1px] border-white p-5">
                <img className="w-[120px]" src="/images/login-profile.png" alt="" />
                <form className='flex flex-col gap-5 p-5'>
                    <div className="flex justify-between w-full text-c_3">
                        <input
                            className='w-[90%] h-13 bg-c_5 p-2 border-none'
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleChange}
                            placeholder="User Name"
                            required
                        />
                        <img className="w-[50px]" src="/images/user-icon.jpeg" alt="" />
                    </div>
                    <div className="flex justify-between w-full text-c_3">
                        <img className="w-[50px]" src="/images/user-icon.jpeg" alt="" />
                        <input
                            className='w-[90%] h-13 bg-c_5 p-2 border-none'
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="University Email"
                            required
                        />
                    </div>
                    <div className="flex relative justify-between w-full text-c_3">
                        
                        <input
                            className='w-[90%] pr-10 relative h-13 bg-c_5 p-2 border-none'
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                        <button className="absolute top-4 right-16" type="button" onClick={() => setShowPassword(!showPassword)}>
                            <div className='w-5'>
                                {showPassword ? 
                                    <img src="/images/open-eye.png" alt="" />
                                : 
                                    <img src="/images/closed-eye.png" alt="" />
                                }
                            </div>
                        </button>
                        <img className="w-[50px]" src="/images/lock-icon.jpeg" alt="" />
                    </div>
                    <div className='w-full'>
                        {errorMessage && <p className='bg-opacity-5 text-center font-bold text-[#930505] text-md'>{errorMessage}</p>}
                    </div>
                    <button 
                        className="bg-c_5 p-2 text-c_3 hover:text-c_5 hover:bg-opacity-[30%] border-2 border-c_3 transition-all duration-200 ease-in"
                        
                        onClick={handleSubmit}
                        type="submit">
                            {isLoading ? (
                                    <span className="">Loading...</span>
                            ) : (
                                'Add User'
                            )}
                    </button>
                </form>
            </div>
    );
}

export default AddUser;
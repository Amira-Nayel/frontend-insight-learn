import { useEffect, useState } from 'react';
import axios from 'axios';

function useUserDetails() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userEmail = localStorage.getItem('email'); // Replace 'email' with the key you used to store the email

        axios.get('https://dj-render-ldb1.onrender.com/users/')
            .then(response => {
                const currentUser = response.data.find(user => user.email === userEmail);
                setUser(currentUser);
                console.log('User details:', currentUser);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    }, []);

    return user;
}

export default useUserDetails;
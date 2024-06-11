document.addEventListener('DOMContentLoaded', () => {
        const changePasswordForm = document.getElementById('changePasswordForm');
    
        changePasswordForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
    
        const oldPassword = document.getElementById('oldpassword').value;
        const newPassword = document.getElementById('newpassword').value;
    
        const userEmail = localStorage.getItem('email');
    
        if (!userEmail) {
            document.getElementById('message').textContent = 'User email is missing.';
            return;
        }
    
        const data = {
            email: userEmail,
            password: oldPassword,
            new_password: newPassword,
        };
    
        fetch('https://dj-render-ldb1.onrender.com/change_password/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json()) 
        .then(data => {
            if (data.hasOwnProperty('token')) {
            console.log('Password changed successfully');
            document.getElementById('message').textContent = 'Password changed successfully.';
            } else {
            console.error(data.details);
            document.getElementById('message').textContent = data.details || 'Password change failed.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('message').textContent = 'An error occurred. Please try again.';
        });
        });
    });
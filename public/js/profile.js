document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://dj-render-ldb1.onrender.com/fetchuserdata';
    const email = localStorage.getItem('email');
    if (!email) {
        console.error('No user email found in local storage.');
        return;
    }

    function updateUI(user) {
        document.getElementById('username').textContent = user.username || 'N/A';
        document.getElementById('email').textContent = user.email || 'N/A';
        document.getElementById('Age').textContent = user.Age || 'N/A';
        document.getElementById('Skills').textContent = user.Skills || 'N/A';
        document.getElementById('Faculty').textContent = user.Faculty || 'N/A';
        document.getElementById('CGPA').textContent = user.CGPA || 'N/A';
        document.getElementById('Grade').textContent = user.Grade || 'N/A';
        document.getElementById('Gender').textContent = user.Gender || 'N/A';
        document.getElementById('Seat No.').textContent = user['Seat No.'] || 'N/A';
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const user = data.find(user => user.email === email);
            if (user) {
                updateUI(user);
                localStorage.setItem('username', user.username || '');
                localStorage.setItem('Age', user.Age || '');
                localStorage.setItem('Skills', user.Skills || '');
                localStorage.setItem('Faculty', user.Faculty || '');
                localStorage.setItem('CGPA', user.CGPA || '');
                localStorage.setItem('Grade', user.Grade || '');
                localStorage.setItem('Gender', user.Gender || '');
                localStorage.setItem('Seat No.', user['Seat No.'] || '');
            } else {
                console.error('User not found');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});
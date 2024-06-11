/* eslint-disable react/prop-types */

const StudentRoute = ({ element }) => {
    const isNotStaff = localStorage.getItem('is_staff') === 'false';
    const isNotSuperuser = localStorage.getItem('is_superuser') === 'false';

    if (isNotStaff && isNotSuperuser) {
        return element;
    } else {
        return  window.location.href = '/login';
    }
};

export default StudentRoute;

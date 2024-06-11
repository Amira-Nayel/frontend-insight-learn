/* eslint-disable react/prop-types */

const StaffRoute = ({ element }) => {
    const isStaff = localStorage.getItem('is_staff') === 'true';

    if (isStaff) {
        return element;
    } else {
        return  window.location.href = '/login';
    }
};

export default StaffRoute;

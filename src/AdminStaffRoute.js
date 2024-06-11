/* eslint-disable react/prop-types */

const AdminStaffRoute = ({ element }) => {
  const isStaff = localStorage.getItem('is_staff') === 'true';
  const isSuperuser = localStorage.getItem('is_superuser') === 'true';

  if (isStaff || isSuperuser) {
    return element;
  } else {
    return window.location.href = '/login';
  }
};

export default AdminStaffRoute;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Reports from './components/reports/Reports';
import Predictions from './components/reports/Predictions';
import { Analytics } from "@vercel/analytics/react";
import Courses from './components/reports/Courses';
import Users from './components/reports/Users';
import UsersData from './components/reports/UsersData';
import AddUser from './components/AddUser';
import Sessions from './components/reports/Sessions';
import TotalSessions from './components/reports/TotalSessions';
import QuizReport from './components/reports/QuizReports';
import MainDash from './components/reports/MainDash';
import StudentDash from './components/reports/StudentDash';
import Profile from './components/Profile';
import ReportCard from './components/reports/ReportCard';
import AboutUs from './pages/AboutUs';
import PersonalPredictions from './components/reports/PersonalPredictions';
import PersonalReport from './components/reports/PersonalReport';
import AdminRoute from './AdminRoute'; // Adjust the path if needed
import StaffRoute from './StaffRoute'; // Adjust the path if needed
import AdminStaffRoute from './AdminStaffRoute'; // Adjust the path if needed
import StudentRoute from './StudentRoute';
function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
    }, []);
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);
    return (
        <div className="h-auto flex flex-col justify-between">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="dashboard" element={<Dashboard isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} >
                        <Route path='maindash' element={<AdminStaffRoute element={<MainDash />} />} />
                        <Route path='studentdash' element={ <StudentRoute element={<StudentDash />}/> } />
                        <Route path='reports' element={<AdminStaffRoute element={<Reports />} />} />
                        <Route path='predictions' element={<AdminStaffRoute element={<Predictions />} />} />
                        <Route path='personal-predictions' element={<PersonalPredictions />} />
                        <Route path='personal-report' element={<PersonalReport />} />
                        <Route path="users" element={<AdminRoute element={<Users />} />} />
                        <Route path='usersdata' element={<AdminRoute element={<UsersData />} />} />
                        <Route path='add-user' element={<AdminRoute element={<AddUser />} />} />
                        <Route path='users-data' element={<AdminRoute element={<UsersData />} />} />
                        <Route path='sessions' element={<StaffRoute element={<Sessions />} />} />
                        <Route path='totalsessions' element={<StaffRoute element={<TotalSessions />} />} />
                        <Route path='courses' element={<StaffRoute element={<Courses />} />} />
                        <Route path="quizreports/:courseName" element={<StaffRoute element={<QuizReport />} />} />
                        <Route path='profile' element={<Profile />} />
                        <Route path='reportcard' element={<ReportCard />} />
                    </Route>
                </Routes>
            </Router>
            <Analytics />
        </div>
    );
}
export default App;

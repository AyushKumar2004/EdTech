import logo from './logo.svg';
import './App.css';
import { Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/common/Navbar';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import OpenRoute from './components/core/Auth/OpenRoute';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './components/core/Dashboard/MyProfile';
import Dashboard from './pages/Dashboard';
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Error from "./pages/Error"
import Settings from './components/core/Dashboard/Settings';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import Cart from './components/core/Dashboard/Cart';
import { ACCOUNT_TYPE } from './utils/constants';
import { useSelector } from 'react-redux';
import MyCourses from './components/core/Dashboard/MyCourses';
import AddCourse from './components/core/Dashboard/AddCourse';
import EditCourse from './components/core/Dashboard/EditCourse';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import ViewCourse from './pages/ViewCourse';
import VideoDetails from './components/core/ViewCourse/VideoDetails';
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor';

function App() {

  const {user}=useSelector((state)=>state.profile);

  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/catalog/:catalogName' element={<Catalog/>}></Route>
          <Route path='/courses/:courseId' element={<CourseDetails/>}></Route>
          <Route path='/signup' element={<OpenRoute><Signup/></OpenRoute>}></Route>
          <Route path='/login' element={<OpenRoute><Login/></OpenRoute>}></Route>
          <Route path='/forgot-password' element={<OpenRoute><ForgotPassword/></OpenRoute>}></Route>
          <Route path='/update-password/:id' element={<OpenRoute><UpdatePassword/></OpenRoute>}></Route>
          <Route path='/verify-email' element={<OpenRoute><VerifyEmail/></OpenRoute>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Error/>} />
          <Route element={<PrivateRoute><Dashboard/></PrivateRoute>}>
            <Route path='/dashboard/my-profile' element={<MyProfile/>}></Route>
            <Route path="/dashboard/settings" element={<Settings/>} />
            {
              user?.accountType===ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route path="/dashboard/cart" element={<Cart/>} />
                  <Route path='/dashboard/enrolled-courses' element={<EnrolledCourses/>}></Route>
                </>
              )
            }
            {
              user?.accountType===ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                  <Route path='/dashboard/my-courses' element={<MyCourses/>}></Route>
                  <Route path='/dashboard/add-course' element={<AddCourse/>}></Route>
                  <Route path='/dashboard/edit-course/:courseId' element={<EditCourse/>}></Route>
                  <Route path='/dashboard/instructor' element={<Instructor/>}></Route>
                </>
              )
            }
          </Route>
          
          <Route element={
            <PrivateRoute>
              <ViewCourse/>
            </PrivateRoute>
          }>
            {
              user?.accountType===ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route path='view-course/:courseId/section/:sectionId/sub-section/:subSectionId'
                   element={<VideoDetails/>} />
                </>
              )
            }

          </Route>
          
        </Routes>



    </div>
  );
}

export default App;

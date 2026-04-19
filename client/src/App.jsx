import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext.jsx";
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const App = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <div  className="bg-cover backdrop-blur-2xl bg-[url('./bgImage.jpg')] "
    >
      <Toaster />

      <Routes>
        <Route 
          path='/' 
          element={authUser ? <HomePage /> : <Navigate to="/login" />} 
        />

        <Route 
          path='/login' 
          element={!authUser ? <LoginPage /> : <Navigate to="/" />} 
        />

        <Route 
          path='/profile' 
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />} 
        />
      </Routes>

    </div>
  );
};

export default App;
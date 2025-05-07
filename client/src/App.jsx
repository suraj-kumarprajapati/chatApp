
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';

import './App.css';
import { ProtectedRoute } from './components/ProtectedRoute';


function App() {

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute > } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );

}

export default App;

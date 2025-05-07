import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../apiCalls/auth';
import {toast} from 'react-hot-toast';

const Login = () => {

  // initial value for user state
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();



   // submit the form 
   const submitLoginForm = async (e) => {
    e.preventDefault();


    if(!user || !user.email || !user.password) {
      toast.error("Please enter valid details");
      return;
    }

    // login api
    try {
      const response = await loginUser(user);
     
      if(response.success) {
        toast.success(response.message);
        navigate("/");
      }
      else {
        toast.error(response.message);
      }
    }
    catch(error) {
      toast.error(error.message);
    }
  }


  return (
    <>
      <div className="container">
        <div className="container-back-img"></div>
        <div className="container-back-color"></div>
        <div className="card">
          <div className="card_title">
            <h1>Login Here</h1>
          </div>
          <div className="form">
            <form onSubmit={submitLoginForm}>
              <input 
                type="email" 
                placeholder="Email" 
                value={user?.email}
                onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={user?.password} 
                onChange={(e) => setUser((prev) => ({ ...prev, password : e.target.value }))}
              />
              <button>Login</button>
            </form>
          </div>
          <div className="card_terms">
            <span>Don't have an account yet?
              <Link to="/signup">Signup Here</Link>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}


export default Login;
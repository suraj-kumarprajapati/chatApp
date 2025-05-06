

import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { signupUser } from '../../apiCalls/auth';
import {toast} from 'react-hot-toast';

const Signup = () => {

  // initial value for user state
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // submit the form 
  const submitSignupForm = async (e) => {
    e.preventDefault();

    if(!user || !user?.firstName || !user?.lastName || !user?.email || !user?.password) {
      toast.error("Please enter the valid user details");
      return;
    }

    // signup api
    try {
      const response = await signupUser(user);

      if(response.success) {
        toast.success(response.message);
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
            <h1>Create Account</h1>
          </div>
          <div className="form" onSubmit={submitSignupForm}>
            <form>
              <div className="column">
                <input
                  type="text"
                  placeholder="First Name"
                  value={user?.firstName}
                  onChange={(e) => setUser((prev) => ({ ...prev, firstName : e.target.value }))}
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  value={user?.lastName} 
                  onChange={(e) => setUser((prev) => ({ ...prev, lastName : e.target.value }))}
                />
              </div>
              <input 
                type="email" 
                placeholder="Email" 
                value={user?.email} 
                onChange={(e) => setUser((prev) => ({ ...prev, email : e.target.value }))}
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={user?.password} 
                onChange={(e) => setUser((prev) => ({ ...prev, password : e.target.value }))}
              />
              <button>Sign Up</button>
            </form>
          </div>
          <div className="card_terms">
            <span>Already have an account?
              <Link to="/login">Login Here</Link>
            </span>
          </div>
        </div>
      </div>


    </>
  )
}

export default Signup;

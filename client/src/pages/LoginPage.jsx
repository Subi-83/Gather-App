import React, { useState } from 'react'
import assets, { userDummyData } from '../assets/assets.js'
import showTerms from "./showTerms";
import { AuthContext } from '../context/AuthContext.jsx';
import { useContext } from 'react';


const LoginPage = () => {

  const [currState,setCurrState] = useState(
    "Sign Up"
  )

  const [fullName,setFullName] = useState(
    ""
  )

  const [email,setEmail] = useState(
    ""
  )

  const [password,setPassword] = useState(
    ""
  )

  const [bio,setBio] = useState(
    ""
  )

  const [isSubmit,setIsSubmit] = useState(
    false
  )
  const [agreed, setAgreed] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (!agreed) {
      alert("Please agree to Terms & Conditions");
      return;
    }

    if (currState === "Sign Up" && !isSubmit) {
      setIsSubmit(true);
      return;
    }

    login(currState === "Sign Up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio
    });
  };
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      
      {/* {-------left--------} */}
      <img src={assets.icon_logo} alt="logo" className='w-[min(30vw,250px)]'/>
      
      {/* -------right------- */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg' action="">
      <h2 className='font-medium text-2xl flex justify-between items-center'>
        {currState}
        {isSubmit && <img onClick = {() => setIsSubmit(false)} src={assets.arrow_icon} alt="Arrow Icon" className='w-5 cursor-pointer' />}
        
      </h2>
      
      {currState === "Sign Up" && !isSubmit && (
        <input type="text" name="" id="" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white-600' 
        value={fullName} placeholder='Full Name' required onChange={(e)=> setFullName(e.target.value)}/>
      )}

      {!isSubmit && (
        <>
        <input type="email" name="" id="" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white-600' value={email} onChange={(e)=> setEmail(e.target.value)} />

        <input type="password" name="" id="" value={password} placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white-600' onChange={(e)=> setPassword(e.target.value)} />
        </>
      )}
      {
        currState === "Sign Up" && isSubmit && (
          <textarea name="" id="" cols="30" rows={4} placeholder='Provide a short Bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white-600  resize-none'value={bio} onChange={(e)=> setBio(e.target.value)}></textarea>
        )
      }
      <button
        type="submit"
        className="py-3 w-full text-white rounded-lg
                  bg-linear-to-r from-blue-400 to-blue-700 
                  hover:from-blue-500 hover:to-blue-800
                  transition-all duration-300
                  font-semibold
                  shadow-md hover:shadow-lg
                  active:scale-95">
        {currState === "Sign Up" ? "Create Account" : "Login"}
      </button>
    <div className="flex items-center gap-2 mt-4">
      <input
        type="checkbox"
        checked={agreed}
        readOnly
        className="w-4 h-4"
      />

      <p className="text-sm">
        I agree to the{" "}
       <button
          type="button"
          onClick={() =>
            showTerms(
              () => setAgreed(true),   // Agree
              () => setAgreed(false)   // Cancel
            )
          }
          className="text-green-600 underline"
          >

          Terms & Conditions
        </button>

      </p>
    </div>


      <div className='flex flex-col gap-2 '>
        {
          currState === "Sign Up" ? (
            <p className='text-sm text-white-600'>
              Already have an account? <span className='text-green-400 font-medium cursor-pointer'  onClick={()=>{setCurrState("Login");setIsSubmit(false)}}>Login Here !</span> 
            </p>
          ):(
              <p className='text-sm text-white-600'>Create an Account ? <span className='text-green-400 font-medium cursor-pointer' onClick={()=>{setCurrState("Sign Up")}}>Click here</span></p>
          )}

      </div>
      
      </form>

    </div>
  )
}

export default LoginPage
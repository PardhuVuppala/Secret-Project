import React from 'react';
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const [UserName,setUserName] = useState("")
  const Navigate = useNavigate()
  useEffect(()=>
  {
   
    setUserName(Cookies.get('username'))
  
  },[])

  const HandleLogout=(e)=>
  {
     e.preventDefault()
     Cookies.remove('username');
     Cookies.remove('user_id');
     Cookies.remove('token');
     Cookies.remove('role');
     Cookies.remove('user_email');
     Navigate("/")
  }
  return (
    <nav className="bg-pink-200 text-white fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">{UserName}</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
      
            <Link className=" px-3 py-2 rounded-md text-sm font-medium" onClick={HandleLogout}>Logout</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

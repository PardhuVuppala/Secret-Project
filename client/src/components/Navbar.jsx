import React from 'react';
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie';

const Navbar = () => {
  const [UserName,setUserName] = useState("")
  useEffect(()=>
  {
    // Cookies.get('user_id');
    // Cookies.get('token');
    // Cookies.get('role');
    setUserName(Cookies.get('username'))
    // Cookies.get('phone');
    // Cookies.get('user_email')
  },[])
  return (
    <nav className="bg-pink-200 text-white fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">{UserName}</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className=" px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="#" className=" px-3 py-2 rounded-md text-sm font-medium">About</a>
            <a href="#" className=" px-3 py-2 rounded-md text-sm font-medium">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React,{useState} from 'react';
import '../assests/login.css';
import Icon from '../images/logo.svg';
import Login from '../images/login.jpg';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function UserSignup() {
  const [username,setUsername] = useState("");
  const [useremail,setemail] = useState("");
  const [usermobile,setMobile] = useState("");
  const [userpass,setUserpass] = useState("");
  const [usergender,setUsergender] = useState("");
  const [usercountry,setUsercountry] = useState("");
  const [useraddress,setUseraddress] = useState("");
  const [userDOB, setUserDOB] = useState(new Date());
  const notify = (message) => toast(message);
  const Navigate = useNavigate();
  const handleSubmit=(e)=>{
    e.preventDefault();
    const body = {
      username,
      useremail,
      usermobile,
      userpass,
      usergender,
      usercountry,
      useraddress,
      userDOB
    }
    axios.post('http://localhost:4500/user/register',body)
    .then(response => {
      console.log('Response: ',response.data)
      notify("Successfully Registered");
      setTimeout(()=>
      {
          Navigate("/");
      },1000)
    })
    .catch(error => {
    if(error.response && error.response.status === 400)
        {  notify(error.response.data.message);
               console.log(error.response.data.message);
        }
    else
        {
          console.error('Registration failed:', error.message);
        }
        })
        }
  return (
    <div>
    <main className="d-flex align-items-center min-vh-100 py-3 py-md-0">
    <ToastContainer />
    <div className="container">
      <div className="card login-card">
        <div className="row no-gutters">
          <div className="col-md-5">
            <img src={Login} alt="login" className="login-card-img"/>
          </div>
          <div className="col-md-7">
            <div className="card-body">
              <div className="brand-wrapper">
                <img src={Icon} alt="logo" className="logo"/>
              </div>
              <p className="login-card-description">Create your account</p>
              <form onSubmit={handleSubmit}>
                 <div className="form-group">
                    <label for="Name" className="sr-only">Name</label>
                    <input type="text" name="name" id="name" className="form-control" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Name" required/>
                  </div>
                  <div className="form-group">
                    <label for="email" className="sr-only">Email</label>
                    <input type="email" name="email" id="email" className="form-control" value={useremail} onChange={(e)=>setemail(e.target.value)} placeholder="Email address" required/>
                  </div>
                  <div className="form-group">
                    <label for="phone" className="sr-only">Mobile No.</label>
                    <input type="phone" name="name" id="tel" className="form-control" value={usermobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile No." required/>
                  </div>
                  <div className="form-group">
                    <label for="gender" className="sr-only">Gender</label>
                    <select value={usergender} onChange={(e)=>setUsergender(e.target.value)}
                     className="form-control" id="typeFilter" required>
                      <option value="" disabled>Select</option>
                      <option value="Male" className='form-control'>Male</option>
                      <option value="Female" className='form-control'>Female</option>
                    </select>
                  </div>
                  <div className='form-group'>
                    <label for="date" className="sr-only">Date</label>
                    <input type="date" name="date" id="date" className="form-control" value={userDOB} onChange={(e)=>setUserDOB(e.target.value)} required/>
                  </div>
                  <div className="form-group ">
                    <label for="password" className="sr-only">Password</label>
                    <input type="password" name="password" id="password" className="form-control" value={userpass} onChange={(e)=>setUserpass(e.target.value)}  placeholder="***********" required/>
                  </div>
                  <div className="form-group">
                    <label for="country" className="sr-only">Country</label>
                    <input type="text" name="country" id="country" className="form-control" placeholder="Country" value={usercountry} onChange={(e)=>setUsercountry(e.target.value)} required/>
                  </div>
                  <div className="form-group">
                    <label for="address" className="sr-only">Address</label>
                    <input type="text" name="address" id="address" className="form-control" placeholder="Address" value={useraddress} onChange={(e)=>setUseraddress(e.target.value)} required/>
                  </div>
                  <input name="login" id="login" className="btn btn-block login-btn mb-4" type="submit" value="Sign Up"/>
                </form>
                <p className="login-card-footer-text">Return to Home Page?<Link to="/" className="text-reset">click here</Link></p>
            </div>
          </div>
        </div>
      </div>
   
    </div>
  </main>
    </div>
  )
}
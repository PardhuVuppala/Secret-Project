import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import AssetViewer from './AssetViewer';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});
  const [recieverEmail,setRecievierEmail] = useState("")
  const [password,setPasswod] = useState("")
  const Navigate = useNavigate();

  const handleSelectFile = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    try {
        setLoading(true);
        const data = new FormData();
        data.append("my_file", file);
        data.append("email", recieverEmail);  
        data.append("password", password);      

        const res = await axios.post("http://localhost:4500/image/upload", data);
        setRes(res.data);
        setRecievierEmail("")
        setPasswod("")
        setFile(null)

    } catch (error) {
        alert(error.message);
    } finally {
        setLoading(false);
    }
};

useEffect(()=>
{
  const token = Cookies.get("token")
         if (token) {
                 axios
                    .get("http://localhost:4500/user/is-verify", {
                    headers: {
                        "Content-Type": "application/json",
                        token: token,
                    },
                    })
                    .then((response) => {
                    })
                    .catch((error) => {
                console.error(error);
            Navigate("/");
         });
        } else {
      Navigate("/");
    }
})


  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="pt-16 flex flex-col items-center"> {/* Added top padding */}
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md mt-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col w-full max-w-md space-y-2">
            <input
              type="Email"
              placeholder="Email"
              value={recieverEmail}
              onChange={(e) => setRecievierEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPasswod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required
            />
          </div>

          <div className="flex items-center w-full max-w-md">
            <label
              htmlFor="file"
              className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold cursor-pointer hover:bg-gray-300 w-full mr-2"
            >
              Select File
            </label>
            <input
              id="file"
              type="file"
              onChange={handleSelectFile}
              multiple={false}
              className="hidden"
            required />
            {file && <span className="text-gray-600 text-sm">{file.name}</span>}
          </div>
        </div>

          <div className="mt-4">
            {Object.keys(res).length > 0 &&
              Object.keys(res).map((key) => (
                <p key={key} className="text-sm text-gray-700 mt-1">
                  <span className="font-semibold">{key}:</span> {typeof res[key] === "object" ? "object" : res[key]}
                </p>
              ))}
          </div>

          {file && recieverEmail && password && (
            <button
              onClick={handleUpload}
              className={`mt-6 w-full py-2 rounded-md text-white font-semibold ${
                loading ? 'bg-pink-400' : 'bg-pink-200 hover:bg-pink-600'
              } transition-colors`}
            >
              {loading ? "Uploading..." : "Upload to Cloudinary"}
            </button>
          )}
        </div>
      </div>
      <AssetViewer/>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const AssetViewer = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [passwords, setPasswords] = useState({}); 
    const Navigate = useNavigate();


    // Function to fetch assets from the backend
    const fetchAssets = async () => {
        try {
            const user_id = Cookies.get("user_id");
            const response = await fetch(`http://localhost:4500/image/cloudinary-assets/${user_id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch assets');
            }

            setAssets(data.assets);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch assets on component mount
    useEffect(() => {
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
        fetchAssets();
    }, []);

    const handlePasswordChange = (assetId, value) => {
        setPasswords(prev => ({ ...prev, [assetId]: value }));
    };

    const downloadFile = async (url, displayName, assetId) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = displayName; 
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);

            // Delete asset from backend
            await fetch(`http://localhost:4500/image/cloudinary-asset/${assetId}`, {
                method: 'DELETE'
            });

            // Remove asset from local state after deletion
            setAssets(prevAssets => prevAssets.filter(asset => asset._id !== assetId));
        } catch (err) {
            console.error('Error downloading or deleting file:', err);
        }
    };

    // Render loading state, error state, or assets
    if (loading) return <p className="text-center">Loading assets...</p>;
    if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

    return (
        <div className="p-5 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-5">Assets</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {assets.map(asset => (
                    <div 
                        key={asset._id} 
                        className="bg-white border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300" 
                    >
                        {asset.format === 'jpg' || asset.format === 'png' ? (
                            <img 
                                src={asset.url} 
                                alt={asset.displayName} 
                                className="w-full h-auto rounded-md mb-3" 
                            />
                        ) : (
                            <div>
                                <p className="font-bold mb-2">{asset.displayName} (PDF)</p>
                            </div>
                        )}
                        
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={passwords[asset._id] || ""}
                            onChange={(e) => handlePasswordChange(asset._id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />

                        {/* Show download button only if the password matches */}
                        {passwords[asset._id] === asset.password ? (
                            <button 
                                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300"
                                onClick={() => downloadFile(asset.secureUrl, asset.displayName + (asset.format === 'pdf' ? '.pdf' : ''), asset._id)} 
                            >
                                Download
                            </button>
                        ) : (
                            passwords[asset._id] && (
                                <p className="text-red-500 text-center">Incorrect password</p>
                            )
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssetViewer;

import React, { useEffect, useState } from 'react';

const AssetViewer = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch assets from the backend
    const fetchAssets = async () => {
        try {
            const response = await fetch('http://localhost:4500/image/cloudinary-assets'); // Update with your API endpoint
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
        fetchAssets();
    }, []);

    // Function to trigger file download
    const downloadFile = (url, displayName) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = displayName; // Suggest the filename for download
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(blobUrl); // Free up memory
            })
            .catch(err => console.error('Error downloading file:', err));
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
                                {/* Removed the iframe for PDF display */}
                            </div>
                        )}
                        <button 
                            className="w-full mt-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300" 
                            onClick={() => downloadFile(asset.secureUrl, asset.displayName + (asset.format === 'pdf' ? '.pdf' : ''))} // Trigger download
                        >
                            Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssetViewer;

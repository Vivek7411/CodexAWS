import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/code-logo.png";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const SavedCodesPage = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState(null);
  const BURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const userId = localStorage.getItem("userId");
  const reactNavigator = useNavigate();

  const fetchCodes = async () => {
    if (!userId) {
      setError("User ID is required.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BURL}/user/${userId}/rooms`, {
        params: { sortBy, order },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCodes(res.data);
    } catch (err) {
      setError("Failed to load codes. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCodes();
  }, [order]);

  const handleSearch = () => {
    setSearchQuery(searchText);
  };

  const filteredCodes = codes.filter((code) => {
    const formattedDate = new Date(code.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD
    return formattedDate.includes(searchQuery);
  });

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="flex items-center space-x-4">
        <img
          src={logo}
          alt="Codex Logo"
          className="h-9 w-11"
          onClick={() => reactNavigator("/")}
          style={{ cursor: "pointer" }}
        />
        <h1 className="text-xl font-bold text-green-400">Saved Codes</h1>
        
      </div>
      <h1 className="text-2xl font-bold mb-6 text-green-400"></h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by date (YYYY-MM-DD)"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="bg-gray-800 text-green-300 border border-green-500 px-4 py-2 rounded w-full sm:w-1/2 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Search
        </button>
        <select
          className="bg-gray-800 text-green-300 border border-green-500 px-4 py-2 rounded w-full sm:w-40"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-green-400 rounded-full"></div>
        </div>
      ) : filteredCodes.length === 0 ? (
        <div className="text-center text-gray-400">No saved code found.</div>
      ) : (
        <div className="space-y-6">
          {filteredCodes.map((code) => (
            <div
              key={code._id}
              onClick={() => setSelectedCode(code)}
              className="bg-gray-900 border border-green-600 rounded-lg p-4 shadow-md cursor-pointer hover:border-green-400 transition"
            >
              <div className="text-sm text-green-400 mb-2">
                {new Date(code.createdAt).toLocaleString()}
              </div>
              <pre className="whitespace-pre-wrap text-green-300 text-sm overflow-x-auto max-h-32 truncate">
                <code>{code.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}

      {selectedCode && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-green-600 rounded-lg p-6 w-[90%] max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setSelectedCode(null)}
              className="absolute top-2 right-4 text-red-500 hover:text-red-300 text-xl"
            >
              ×
            </button>
            <div className="flex items-center space-x-4">
              <img
                src={logo}
                alt="Codex Logo"
                className="h-9 w-11"
                onClick={() => reactNavigator("/")}
                style={{ cursor: "pointer" }}
              />
              <h1 className="text-xl font-bold">CODEX</h1>
            </div>
            <div className="text-sm text-green-400 mb-2">
              Created At: {new Date(selectedCode.createdAt).toLocaleString()}
            </div>
            <pre className="whitespace-pre-wrap text-green-300 text-sm overflow-x-auto">
              <code>{selectedCode.code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedCodesPage;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('/api/get-user-sessions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          setSessions(result.sessions);
        } else {
          alert(result.message || 'Failed to fetch sessions.');
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  const openSession = (roomId) => {
    navigate(`/editor?roomId=${roomId}`);
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      {sessions.length === 0 ? (
        <p>No saved sessions found.</p>
      ) : (
        sessions.map((session) => (
          <div key={session.roomId} className="session-card">
            <h3>Room ID: {session.roomId}</h3>
            <p>Saved on: {new Date(session.createdAt).toLocaleString()}</p>
            <button onClick={() => openSession(session.roomId)}>Open</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;

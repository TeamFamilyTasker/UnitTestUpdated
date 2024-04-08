import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [users,setUsers]=useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    const fetchEvents = async () => {
      const response = await fetch('http://localhost:5000/api/events/all-events', {
        headers: {
          'Content-Type': 'application/json',
          'x-token': token,
        },
      });
      const json = await response.json();
      console.log(json); // Debugging to see the fetched data
      if (response.ok && json.events) {
        setEvents(json.events);
      } else {
        console.error('Failed to fetch:', response.statusText);
      }
    };
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/api/auth/all-users', {
        headers: {
          'Content-Type': 'application/json',
          'x-token': token,
        },
      });
      const json = await response.json();
      if (response.ok && json.users) {
        setUsers(json.users);
      } else {
        console.error('Failed to fetch users:', response.statusText);
      }
    };

    // Call both fetch functions
    fetchEvents();
    fetchUsers();
  }, []);

 return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <div className="data-section">
        <h3>Users</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              {/* Other columns */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                {/* Other data */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="data-section">
        <h3>Events</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Start</th>
              <th>End</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{new Date(event.start).toLocaleString()}</td>
                <td>{new Date(event.end).toLocaleString()}</td>
                <td>{event.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

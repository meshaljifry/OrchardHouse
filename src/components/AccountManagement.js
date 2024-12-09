import React, { useEffect, useState } from 'react';

const AccountManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // Assuming you have a list of roles

  useEffect(() => {
    fetchUsers();
    fetchRoles(); // Fetch roles if not already available
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}:5000/api/getUserList`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    // Fetch roles from your backend or define them statically
    setRoles(['Admin', 'Manager', 'Employee', 'Visitor']); // Example roles
  };

  const updateUserRole = async (userID, newRoleID) => {
    try {
      const response = await fetch(`${BACKEND_URL}:5000/api/updateUserRole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, roleID: newRoleID }),
      });

      if (response.ok) {
        console.log('User role updated successfully');
        fetchUsers(); // Refresh the user list
      } else {
        console.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div>
      <h1>Manage Accounts</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userID}>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.roleID}</td>
              <td>
                <select
                  value={user.roleID}
                  onChange={(e) => updateUserRole(user.userID, e.target.value)}
                >
                  {roles.map((role, index) => (
                    <option key={index} value={index + 1}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountManagement;

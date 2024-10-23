// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Spacer } from '@nextui-org/react';
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter a username and password.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/UserAccount?username=${username}&passwordHash=${password}`);
      if (!response.ok) {
        throw new Error("Login failed. Incorrect username or password.");
      }

      const { passwordHash, roleID,userID } = await response.json();

      if (response.ok) {
        // Store roleID and username for session management
        localStorage.setItem('roleID', roleID);
        localStorage.setItem('userID', userID);
        localStorage.setItem('username', username); // Store the username in localStorage

        // Redirect to the dashboard and reload the page to update Layout.js
        if (roleID === 1 || roleID === 2) {
          navigate('/');
        } else if (roleID === 3) {
          navigate('/employee-dashboard');
        } else {
          navigate('/user-dashboard');
        }

        // Force a reload of the layout to immediately reflect login status
        window.location.reload();
      } else {
        alert('Login failed. Incorrect username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Login failed. Incorrect username or password.');
    }
  
  };

  return (
    <div>
      <h1>Login Page</h1>
      <Spacer y={2} />
      <Input
        isRequired
        isClearable
        type="text"
        label="Username"
        placeholder="Enter your username"
        onValueChange={setUsername}
        className="max-w-xs m-2"
      />
      <Spacer y={2} />
      <Input
        isRequired
        label="Password"
        placeholder="Enter your password"
        onValueChange={setPassword}
        endContent={
          <button type="button" onClick={toggleVisibility}>
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isVisible ? 'text' : 'password'}
        className="max-w-xs m-2"
      />
      <Spacer y={2} />
      <Button onPress={handleLogin}>Login</Button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

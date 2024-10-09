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
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter a username and password.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/UserAccount?username=${username}`);
      if (!response.ok) {
        throw new Error('User not found or server error');
      }

      const { passwordHash, RoleID } = await response.json();

      if (password === passwordHash) {
        console.log('Login successful!');
        localStorage.setItem('roleID', RoleID); // Store RoleID for role-based routing

        // Redirect based on RoleID with consistent route paths
        if (RoleID === 1 || RoleID === 2) {
          navigate('/dashboard');
        } else if (RoleID === 3) {
          navigate('/employee-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        alert('Login failed. Incorrect username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
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
    </div>
  );
}

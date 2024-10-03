import React, { useState } from 'react';
import {EyeFilledIcon} from "../components/EyeFilledIcon";
import {EyeSlashFilledIcon} from "../components/EyeSlashFilledIcon";
import { Input, Button, Spacer } from '@nextui-org/react';
// import bcrypt from 'bcryptjs';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {
    // Check if username and password are not empty
    if (!username || !password) {
      alert('Please enter a username and password.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/UserAccount?username=${username}`);
      if (!response.ok) {
        throw new Error('User not found or server error');
      }
      const passwordHash = await response.json();
      
      // Compare the entered password with the fetched password hash
      if (password === passwordHash) {
        console.log('Login successful!');
        // Redirect to dashboard or perform other actions
      } else {
        console.log('Login failed. Incorrect username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

    return (
      <div>
        <h1>Login Page</h1>
        {/* Add your login form here */}
      
        <Spacer y={2} />
        <Input
          isRequired
          isClearable
          type="email"
          label="Username"
          variant="flat"
          placeholder="Enter your username"
          defaultValue=""
          // onClear={() => console.log("input cleared")}
          onValueChange={setUsername}
          className="max-w-xs m-2"
        />
        <Spacer y={2} />
        <Input
        isRequired
          label="Password"
          variant="flat"
          placeholder="Enter your password"
          onValueChange={setPassword}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs m-2"
        />
        <Spacer y={2} />
        <Button onPress={handleLogin}>Login</Button>
    
      </div>
    );
  }

  
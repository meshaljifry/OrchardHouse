import React, { useState } from 'react';
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";
import { Input, Button, Spacer } from '@nextui-org/react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {
    // Clear previous messages
    setError('');
    setSuccess('');

    try {
      // Send a POST request to the backend for login validation
      const response = await fetch('http://localhost:5000/api/UserAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Login successful
        setSuccess(data.message);
      } else {
        // Login failed
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred while trying to log in.');
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
        variant="flat"
        placeholder="Enter your username"
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

      {/* Display error or success message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

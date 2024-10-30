// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Spacer } from '@nextui-org/react';
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";

export default function Login() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useNavigate();

  const handleRegistration = async () => {
    if (!username || !password || !password2) {
        setErrorMessage('Please enter a username and password.');
      return;
    }
    if (password != password2){
        setErrorMessage('Passwords do not match')
        return;
    }
    
    try {
      await fetch('http://localhost:5000/api/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleID: 4, firstName: firstName, lastName: lastName })
      })  
      .then(response => response.json())
      .then(data => {
      if (data.userID) {
        console.log('User ID:', data.userID);
        setUserID(data.userID);
      } else {
        console.error('Failed to retrieve userID');
      }
      })
      .catch(error => {
        console.error('Error during login:', error);
        setErrorMessage('Registration failed please make sure all fields are filled out');
      });
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Registration failed please make sure all fields are filled out');
    }
    
    try {
      const accountResponse = await fetch(`http://localhost:5000/api/registerAccount?userID=${userID}&username=${username}&passwordHash=${password}`);
      if (!accountResponse.ok) {
        throw new Error("Registering account failed");
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Registration failed please make sure all fields are filled out');
    }
  
  };

  return (
    <div>
      <h1>Registeration</h1>
      <Spacer y={2} />
      <Input
        isRequired
        isClearable
        type="text"
        label="First Name"
        placeholder="Enter your first name"
        onValueChange={setFirstName}
        className="max-w-xs m-2"
      />
      <Spacer y={2} />
      <Input
        isRequired
        isClearable
        type="text"
        label="Last Name"
        placeholder="Enter your last name"
        onValueChange={setLastName}
        className="max-w-xs m-2"
      />
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
      <Input
        isRequired
        label="Password2"
        placeholder="Enter your password again"
        onValueChange={setPassword2}
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
      <Button onPress={handleRegistration}>Register</Button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

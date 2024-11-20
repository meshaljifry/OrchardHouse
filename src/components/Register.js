// Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Spacer } from '@nextui-org/react';
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentUserID, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTosChecked, setIsTosChecked] = useState(false);
  const navigate = useNavigate();
  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (currentUserID) {
      console.log('Current ID after update:', currentUserID);
      handleRegistration();
      navigate('/login');
    }
  }, [currentUserID]);

  const checkUsername = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/checkUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      });
  
      const data = await response.json();
      if (response.ok) {
        return data.exists; // Return true if username exists
      } else {
        console.error('Error checking username:', data);
        setErrorMessage('Error checking username.');
        return true; // Assume username exists in case of error
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setErrorMessage('Error checking username.');
      return true;
    }
  };

  const createUser = async () => {
    if (!username || !password || !password2) {
      setErrorMessage('Please enter a username and password.');
      return;
    }
    if (password !== password2) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!isTosChecked) {
      setErrorMessage('You must agree to the Terms of Service.');
      return;
    }
    
    const usernameExists = await checkUsername();
    if (usernameExists) {
        setErrorMessage('Username already exists.');
        return;
    }
    try {
        const response = await fetch('http://localhost:5000/api/registerUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roleID: 4, firstName: firstName, lastName: lastName })
        })  
        const data = await response.json();
        console.log(data);
          if (response.ok) {
              if (data.userID) {
                setUserID(data.userID);
                console.log('User ID:', data.userID);
              } else {
                  console.error('Failed to retrieve userID');
              }
          } else {
          console.error('Error during user creation:', data);
          setErrorMessage('User was not created. Please make sure all fields are filled out.');
          }
    } catch (error) {
            console.error('Error during user creation:', error);
            setErrorMessage('Registration failed please make sure all fields are filled out');
    }
  };
  

  const handleRegistration = async () => {
    if (!username || !password || !password2) {
        setErrorMessage('Please enter a username and password.');
      return;
    }
    if (password !== password2){
        setErrorMessage('Passwords do not match')
        return;
    }
    
    try {   
      await fetch('http://localhost:5000/api/registerAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: currentUserID, username: username, passwordHash: password })
      })
      .then(response => response.json())
    } catch (error) {
      console.error('Error during registration:', error);
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
        label="Confirm Password"
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
      <div>
        <input
          type="checkbox"
          checked={isTosChecked}
          onChange={(e) => setIsTosChecked(e.target.checked)}
        />
        <label>
          I agree to the <a href="/fake-tos" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        </label>
      </div>
      <Spacer y={2} />
      <Button onPress={createUser}>Register</Button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

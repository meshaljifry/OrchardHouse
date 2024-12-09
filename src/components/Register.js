// Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";
import { BACKEND_URL } from '../config.js';

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
  const [isTosOpen, setIsTosOpen] = useState(false);
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
      const response = await fetch(`${BACKEND_URL}:5000/api/checkUsername`, {
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
        const response = await fetch(`${BACKEND_URL}:5000/api/registerUser`, {
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
      await fetch(`${BACKEND_URL}:5000/api/registerAccount`, {
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
        <label style={{ marginLeft: '8px' }}>
          I agree to the <Button onPress={() => setIsTosOpen(true)}  auto flat style={{color:'blue', background:'none'}}>Terms of Service</Button>
        </label>
      </div>
      <Spacer y={2} />
      <Button onPress={createUser}>Register</Button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Modal isOpen={isTosOpen} onOpenChange={setIsTosOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Apple Orchard Terms of Service</ModalHeader>
              <ModalBody style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              <p>Welcome to Apple Orchard. By visiting our orchard, using our facilities, registering for an account, or purchasing our products, you agree to the following terms and conditions. Please read them carefully before engaging with our services or products.</p>
          
              <p><strong>1. Assumption of Risk</strong><br />
              Visiting the Orchard and participating in activities such as apple picking, walking through our grounds, or other recreational events involve inherent risks. By entering our property, you voluntarily assume all risks associated with your visit, including but not limited to personal injury, property damage, or allergic reactions.</p>
              
              <p><strong>2. Product Use Disclaimer</strong><br />
              All products, including fresh produce, baked goods, or beverages, are provided "as-is" without any express or implied warranty. While we take care to ensure the quality and safety of our products, we are not responsible for any adverse effects resulting from their use, consumption, or storage.</p>
              
              <p><strong>3. Limitation of Liability</strong><br />
              To the maximum extent permitted by law, Apple Orchard, its owners, employees, and affiliates shall not be held liable for any injuries, accidents, or damages incurred while on our property or resulting from the use of our products. This includes, but is not limited to:</p>
              <ul>
                <li>Injuries from slips, trips, or falls.</li>
                <li>Injuries from contact with equipment, trees, or other patrons.</li>
                <li>Reactions to allergens, including but not limited to nuts, gluten, or pesticides.</li>
              </ul>
              
              <p><strong>4. Compliance with Rules</strong><br />
              Visitors are required to adhere to all posted safety guidelines and instructions provided by our staff. Failure to follow these guidelines may increase the risk of injury, for which the Orchard will not be held responsible.</p>
              
              <p><strong>5. Indemnification</strong><br />
              By visiting the Orchard or purchasing our products, you agree to indemnify and hold harmless Apple Orchard and its representatives from any claims, damages, or legal fees arising from your actions or failure to comply with these Terms of Service.</p>
              
              <p><strong>6. Governing Law</strong><br />
              These terms are governed by the laws of Wisconsin, and any disputes shall be resolved exclusively within the jurisdiction of Menomonie.</p>
              
              <p>If you have any questions about these terms, please contact us at info@appleorchard.com.</p>
              
              <p>By entering our property or purchasing our products, you acknowledge that you have read, understood, and agreed to these Terms of Service.</p>
                
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

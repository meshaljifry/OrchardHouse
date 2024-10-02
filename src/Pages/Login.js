import React, { useState } from 'react';
import {EyeFilledIcon} from "../components/EyeFilledIcon";
import {EyeSlashFilledIcon} from "../components/EyeSlashFilledIcon";
import { Input, Button, Spacer } from '@nextui-org/react';
import bcrypt from 'bcryptjs';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Username:', username);
    console.log('Hashed Password:', hashedPassword);
    
    // const db = mysql.createConnection({
    //   host: 'appleorcharddatabase.cz04caw0ahsw.us-east-2.rds.amazonaws.com',
    //   user: 'admin',
    //   password: 'jD1mOUsCvcIxk7PTH2iV',
    //   database: 'your_database_name'
    // });
    
    // db.connect((err) => {
    //   if (err) {
    //     console.error('Error connecting to the database:', err);
    //     return;
    //   }
    //   console.log('Connected to the MySQL database.');
    // });
    //TODO: Need to  pull password from database to see if it matches password entered.
    if (bcrypt.compare(password, hashedPassword)) { // check if password matches hashed password
      // login successful, redirect to dashboard
      console.log('Login successful!');
    } else {
      // login failed, display error message
      console.log('Login failed. Incorrect username or password.');
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

  
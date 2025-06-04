import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      setLoginError('');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setLoginError('Invalid email or password');
    }
  };

  return (
    <div className='login-container'>
      <p className='tasty-header' onClick={() => navigate('/')}>TastyNest</p>
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} noValidate>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error-text">{emailError}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="error-text">{passwordError}</p>}

          {loginError && <p className="error-text">{loginError}</p>}

          <a href="/register" className='not-registered'>Not Registered?</a>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

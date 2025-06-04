import React, { useState, useEffect } from 'react';
import "./Login.css"; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required";
    else if (username.length < 3) newErrors.username = "Username must be at least 3 characters";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", { username, email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setErrors({ general: "Registration failed. Try again." });
    }
  };

  return (
    <div className='login-container'>
      <p className='tasty-header' onClick={() => { navigate('/') }}>TastyNest</p>
      <div className="auth-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister} noValidate>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}

          <input 
            type="email"
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          {errors.general && <p className="error-text">{errors.general}</p>}

          <a href="/login" className='have-account'>Already have an Account?</a>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

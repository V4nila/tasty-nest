import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import PrivateRoute from './components/PrivateRoute'
import Dashboaard from './components/Dashboaard'
import AddRecipe from './components/AddRecipe'
import Profile from './components/Profile'
import SearchRecipes from './components/SearchRecipes'
function App() {


  return (
    <>
    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<Dashboaard/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path="/search" element={<SearchRecipes />} />

        
        

      </Route>

    </Routes>
     
    </>
  )
}

export default App

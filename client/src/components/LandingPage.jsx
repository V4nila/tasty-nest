import {Link} from "react-router-dom";
import "./LandingPage.css"


export default function LandingPage() {
    
    return (
      <div className='container'>
        <div className='header'>
          <p>TastyNest</p>
          <div className='links'>
            <Link to="/login" className="link">Login</Link>
            <Link to="/register" className="link">Register</Link>
          </div>
        </div>

        <div className="mid-section">
            
            <p className="title">Your Personal</p>
            <p className="title2">Recipe Book</p>
          
            
            <p className="description">Organize, discover, and share your favorite recipes with ease </p>
            <Link to="/login" className="get-started">Get Started</Link>

        </div>
        
        
        
        <div className="lower-section">

    <div className="functionalities">


<h2 className="name">Add Recipes</h2>
<p className="about">Eaily add and manage your recipes. </p>


</div>
<div className="functionalities">


<h2 className="name">Search & Filter</h2>
<p className="about">Find recipes quickly by ingredients or categories.</p>


</div>
<div className="functionalities">


<h2 className="name">Save Favorites</h2>
<p className="about">Keep your favorite recipes handy. </p>


</div>

        </div>

        <div className="footer">

            <h2 className="ending-note">&copy; 2025 TastyNest. All rights reserved.</h2>

        </div>
      </div>
    );
  }
  
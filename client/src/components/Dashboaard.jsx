import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Dashboard.css";
import AddRecipe from "./AddRecipe";  
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [externalMeals, setExternalMeals] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const extractIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/getuser', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    const fetchUserRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/recipes", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserRecipes(res.data);
      } catch (error) {
        console.error('Failed to fetch user recipes:', error);
      }
    };

    const fetchExternalMeals = async () => {
      try {
        const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${randomLetter}`);
        if (res.data.meals) {
          const external = res.data.meals.slice(0, 5).map(meal => ({
            _id: meal.idMeal,
            title: meal.strMeal,
            imageUrl: meal.strMealThumb,
            ingredients: extractIngredients(meal),
            instructions: meal.strInstructions,
            tags: meal.strTags ? meal.strTags.split(',') : [],
          }));
          setExternalMeals(external);
        }
      } catch (error) {
        console.error('Failed to fetch external meals:', error);
      }
    };

    fetchUser();
    fetchUserRecipes();
    fetchExternalMeals();
  }, []);

  
  useEffect(() => {
    if (!searchActive) {
      setRecipes([...userRecipes, ...externalMeals]);
    }
  }, [userRecipes, externalMeals, searchActive]);

 
  useEffect(() => {
    const searchMeals = async () => {
      const term = searchTerm.trim().toLowerCase();

      if (term === '') {
        setSearchActive(false);
        setRecipes([...userRecipes, ...externalMeals]);
        return;
      }

      setSearchActive(true);

      const filteredUserRecipes = userRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(term)
      );

      try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        let externalResults = [];
        if (res.data.meals) {
          externalResults = res.data.meals.map(meal => ({
            _id: meal.idMeal,
            title: meal.strMeal,
            imageUrl: meal.strMealThumb,
            ingredients: extractIngredients(meal),
            instructions: meal.strInstructions,
            tags: meal.strTags ? meal.strTags.split(',') : [],
          }));
        }

        const combinedResults = [...filteredUserRecipes, ...externalResults];
        setRecipes(combinedResults);
      } catch (error) {
        console.error("Search failed:", error);
        setRecipes(filteredUserRecipes);
      }
    };

    const timeout = setTimeout(searchMeals, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, userRecipes, externalMeals]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-top-part">
        <h2 className="brand">TastyNest</h2>
        <h2 className="user-info" onClick={()=>{navigate("/profile")}}>Welcome, {username}</h2>
      </div>

      <div className='utils'>
        <button  className='add-button'
        onClick={() => setModalOpen(true)}
      
        
        
        >+ Add Recipe</button>
        <button className='add-button' onClick={()=>{navigate('/search')}}>Search by Ingredients</button>
        <form className='dashboard-search' onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder='Search Recipes...'
            className='search-input'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' className='search-button'>
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AddRecipe />
      </Modal>

      <div className="recipe-grid">
        {recipes.length === 0 ? (
          <p className="no-results">No recipes found for "{searchTerm}".</p>
        ) : (
          recipes.map(recipe => (
            <div className="recipe-card" key={recipe._id} onClick={() => setSelectedRecipe(recipe)}>
              <img
                src={recipe.imageUrl || "https://via.placeholder.com/300x180?text=No+Image"}
                alt={recipe.title}
                className="recipe-image"
              />
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                <div className="recipe-tags">
                  {recipe.tags && recipe.tags.map((tag, idx) => (
                    <span key={idx} className="recipe-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedRecipe(null)}>×</button>
            <h2>{selectedRecipe.title}</h2>
            <img src={selectedRecipe.imageUrl} alt={selectedRecipe.title} />
            <p><strong>Ingredients:</strong> {selectedRecipe.ingredients.join(", ")}</p>
            <p><strong>Instructions:</strong> {selectedRecipe.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}

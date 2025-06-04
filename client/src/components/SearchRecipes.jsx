import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SearchRecipes.css';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

export default function SearchRecipes() {
  const [input, setInput] = useState('');
  const [dbRecipes, setDbRecipes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDbRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/recipes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDbRecipes(res.data);
      } catch (err) {
        console.error('Error loading DB recipes:', err);
      }
    };

    fetchDbRecipes();
  }, []);

  const fetchMealDbRecipeDetails = async (idMeal) => {
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );
      return res.data.meals ? res.data.meals[0] : null;
    } catch (err) {
      console.error('Error fetching meal details:', err);
      return null;
    }
  };

  const fetchMealDbRecipes = async (ingredient) => {
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      return res.data.meals || [];
    } catch (err) {
      console.error('Error fetching from MealDB:', err);
      return [];
    }
  };

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const ingredients = input
        .toLowerCase()
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

     
      const filteredDbRecipes = dbRecipes
        .filter((recipe) => {
          if (!Array.isArray(recipe.ingredients)) return false;
          const recipeIngredients = recipe.ingredients.map((i) =>
            i.toLowerCase().trim()
          );
          return ingredients.every((ing) => recipeIngredients.includes(ing));
        })
        .map((r) => ({
          id: r._id,
          title: r.title,
          imageUrl: r.imageUrl,
          ingredients: r.ingredients,
          instructions: r.instructions,
          source: 'TastyNest',
        }));

      const apiResponses = await Promise.all(
        ingredients.map((ing) => fetchMealDbRecipes(ing))
      );
      const apiResults = apiResponses.flat();

      const uniqueMealsMap = new Map();
      apiResults.forEach((meal) =>
        uniqueMealsMap.set(meal.idMeal, meal)
      );

      const detailedMeals = await Promise.all(
        [...uniqueMealsMap.values()].map((meal) =>
          fetchMealDbRecipeDetails(meal.idMeal)
        )
      );

      const strictMealDbResults = detailedMeals
        .filter((meal) => {
          if (!meal) return false;
          const allIngredients = [];
          for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`];
            if (ing && ing.trim())
              allIngredients.push(ing.toLowerCase().trim());
          }
          return ingredients.every((ing) =>
            allIngredients.includes(ing)
          );
        })
        .map((meal) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          imageUrl: meal.strMealThumb,
          ingredients: Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`])
            .filter(Boolean)
            .join(', '),
          instructions: meal.strInstructions,
          source: 'MealDB',
        }));

      setResults([...filteredDbRecipes, ...strictMealDbResults]);
    } catch (err) {
      console.error('Error during search:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h2 className="search-back" onClick={() => navigate('/dashboard')}>
        <i className="fa fa-arrow-left"></i> back to dashboard
      </h2>

      <div className="search-box">
        <h1 className="search-header">Search by Ingredients</h1>
        <input
          type="text"
          placeholder="e.g. chicken, rice"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="search-input"
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading ? (
        <p className="search-loading">Loading recipes...</p>
      ) : (
        results.length > 0 && (
          <>
            <h3 className="search-section-title">🍽 Recipes You Can Make</h3>
            <div className="search-results-grid">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="search-card"
                  onClick={() => {
                    setSelectedRecipe(r);
                    setIsModalOpen(true);
                  }}
                >
                  <h4 className="search-card-title">{r.title}</h4>
                  {r.imageUrl && (
                    <img
                      src={r.imageUrl}
                      alt={r.title}
                      className="search-card-img"
                    />
                  )}
                  <p className="search-source">{r.source}</p>
                </div>
              ))}
            </div>
          </>
        )
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedRecipe && (
          <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            <h2>{selectedRecipe.title}</h2>
            <img
              src={selectedRecipe.imageUrl}
              alt={selectedRecipe.title}
              style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }}
            />
            <p>
              <strong>Ingredients:</strong>{' '}
              {Array.isArray(selectedRecipe.ingredients)
                ? selectedRecipe.ingredients.join(', ')
                : selectedRecipe.ingredients || 'N/A'}
            </p>
            <p>
              <strong>Instructions:</strong> {selectedRecipe.instructions || 'N/A'}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

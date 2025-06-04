import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    tags: '',
    image: null,
  });

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('http://localhost:3000/api/auth/getuser', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const recipeRes = await axios.get('http://localhost:3000/api/recipes/my-recipes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipes(recipeRes.data);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/recipes/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecipes(recipes.filter((recipe) => recipe._id !== itemId));
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('ingredients', formData.ingredients);
      data.append('instructions', formData.instructions);
      data.append('tags', formData.tags);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await axios.put(
        `http://localhost:3000/api/recipes/${selectedRecipe._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updated = recipes.map((r) =>
        r._id === selectedRecipe._id ? res.data : r
      );
      setRecipes(updated);
      setIsModalOpen(false);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");

  }

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setEditMode(false);
    setIsModalOpen(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-box">
      <h2 className="back-to-dshboard" onClick={() => navigate('/dashboard')}>
        <i className="fa fa-arrow-left arrow"></i> dashboard
      </h2>

      <div className="profile-container">
        <h2 className="profile-header">👤 Welcome, {user.username}</h2>
        <h2 className='profile-logout' onClick={()=>{logout()}}><i className="fa fa-sign-out-alt"></i>
</h2>
        <p className="profile-email">Email: {user.email}</p>

        <h3 className="profile-subheader">📋 Your Recipes</h3>
        {recipes.length === 0 ? (
          <p className="no-recipes">You haven't added any recipes yet.</p>
        ) : (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="recipe-card"
                onClick={() => openModal(recipe)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') openModal(recipe);
                }}
              >
                {recipe.imageUrl && (
                  <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
                )}
                <h4 className="recipe-title">{recipe.title}</h4>
                <p className="recipe-tags">
                  Tags: {recipe.tags && recipe.tags.length > 0 ? recipe.tags.join(', ') : 'None'}
                </p>
              </div>
            ))}
          </div>
        )}

        {selectedRecipe && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {editMode ? (
              <div className="edit-form fade-in">
                <label>
                  Title
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="modal-input"
                  />
                </label>

                <label>
                  Ingredients
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) =>
                      setFormData({ ...formData, ingredients: e.target.value })
                    }
                    className="modal-input"
                  />
                </label>

                <label>
                  Instructions
                  <textarea
                    value={formData.instructions}
                    onChange={(e) =>
                      setFormData({ ...formData, instructions: e.target.value })
                    }
                    className="modal-input"
                  />
                </label>

                <label>
                  Tags
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="modal-input"
                  />
                </label>

                <label>
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    className="modal-input"
                  />
                </label>

                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    style={{
                      marginTop: '10px',
                      width: '200px',
                      borderRadius: '8px',
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="fade-in">
                <h2>{selectedRecipe.title}</h2>
                {selectedRecipe.imageUrl && (
                  <img
                    src={selectedRecipe.imageUrl}
                    alt={selectedRecipe.title}
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      marginBottom: '15px',
                    }}
                  />
                )}
                <p>
                  <strong>Ingredients:</strong> {selectedRecipe.ingredients || 'N/A'}
                </p>
                <p>
                  <strong>Instructions:</strong> {selectedRecipe.instructions || 'N/A'}
                </p>
                <p>
                  <strong>Tags:</strong> {selectedRecipe.tags?.join(', ') || 'None'}
                </p>
              </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              {editMode ? (
                <>
                  <button className="btn-save" onClick={handleSave}>
                    Save
                  </button>
                  <button className="btn-cancel" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditMode(true);
                      setFormData({
                        title: selectedRecipe.title,
                        ingredients: selectedRecipe.ingredients,
                        instructions: selectedRecipe.instructions,
                        tags: selectedRecipe.tags?.join(', ') || '',
                        image: null,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(selectedRecipe._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

const express = require('express')
const router = express.Router()
const { getAllRecipes, createRecipe, getUsersRecipes, deleteRecipe, updateRecipe } = require('../controllers/recipeController')
const { protect } = require('../middleware/authMiddleware')
const parser = require('../configs/multerConfig');

router.get('/', getAllRecipes)
router.post('/',protect ,parser.single("image") ,createRecipe);
router.get("/my-recipes" , protect , getUsersRecipes);
router.delete('/:id', protect, deleteRecipe);
router.put("/:id" , parser.single("image") ,protect,updateRecipe);

module.exports = router
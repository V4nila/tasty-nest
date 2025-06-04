const Recipe  = require('../models/Recipe');


const getAllRecipes = async (req,res)  => {
try{
    const recipes = await Recipe.find().populate('author', 'username email')
    res.json(recipes);
}catch(err){
    res.status(500).json({ message: 'Server Error' })
}


}


const createRecipe = async (req,res) => {

try{
    const { title, ingredients, instructions, tags } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    const newRecipe = new Recipe({
        title,
        ingredients,
        instructions,
        imageUrl,
        tags,
        author: req.user._id 
      })
      await newRecipe.save()
    res.status(201).json(newRecipe)

} catch (err) {
    console.error("❌ Error in createRecipe:");
  
    
    try {
      console.error("Error as string:", err.toString());
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      console.error("Error full JSON:", JSON.stringify(err, null, 2));
    } catch (e) {
      console.error("Failed to stringify error:", e);
    }
  
    res.status(400).json({ message: err.message || 'Invalid recipe data' });
  }
  

}

const getUsersRecipes = async (req,res) => {

try{
    const userId = req.user._id;
    const userRecipes = await Recipe.find({author : userId}).sort({ createdAt: -1 });
    res.status(200).json(userRecipes);




}catch(err){
    console.log(err);
    res.status(500).json({message:"error fetching users recipes"})
}

}
const deleteRecipe = async (req, res) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user._id;
  
     
      const recipe = await Recipe.findById(recipeId);
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
     
      if (recipe.author.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized to delete this recipe' });
      }
  
      await Recipe.findByIdAndDelete(recipeId);
      res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (err) {
      console.error('Delete recipe error:', err);
      res.status(500).json({ message: 'Server error while deleting recipe' });
    }
  };

  const updateRecipe = async (req, res) => {
    try {
      
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  
     
      recipe.title = req.body.title || recipe.title;
      recipe.ingredients = req.body.ingredients || recipe.ingredients;
      recipe.instructions = req.body.instructions || recipe.instructions;
  
      
      if (req.body.tags) {
        recipe.tags = req.body.tags.split(',').map(tag => tag.trim());
      }
  
      
      if (req.file) {
       
        recipe.imageUrl = req.file.path;
      }
  
      await recipe.save();
  
      res.json(recipe);
    } catch (err) {
      console.error('Error updating recipe:', err);
      res.status(500).json({ message: 'Server error while editing recipe' });
    }
  };

module.exports = { getAllRecipes, createRecipe  , getUsersRecipes,deleteRecipe , updateRecipe}
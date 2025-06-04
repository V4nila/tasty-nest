const express = require('express');
const {loginUser , registerUser ,getUser} = require("../controllers/authController");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')

router.post("/login" , loginUser);
router.post('/register', (req, res) => {
    
    registerUser(req, res);
  });
  router.get("/getuser" ,protect, getUser);
  

module.exports = router;
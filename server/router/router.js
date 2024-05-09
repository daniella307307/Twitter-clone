const express=require('express');
const userController= require('../controller/userController');

const router=express.Router();

//sign up router
router.post('/register',userController.signUp);

//login router
router.post('/login',userController.signIn);
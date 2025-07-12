const express = require("express");
const router = express.Router();

const {createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee} = require("../controllers/onBoardingController");

// ➕ Create a new employee
router.post("/createBoardingEmployee", createEmployee);

// 📋 Get all employees
router.get("/getBoardingEmployee", getAllEmployees);

// 🔍 Get one employee by ID
router.get("/getBoardingEmployee/:id", getEmployeeById);

// ♻️ Update employee by ID
router.put("/updateBoardingEmployee/:id", updateEmployee);

// ❌ Delete employee by ID
router.delete("/deleteBoardingEmployee/:id", deleteEmployee);



module.exports = router;

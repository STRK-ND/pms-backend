const express = require('express');
const router = express.Router();
const supremeAdminVerifyToken = require("../middleware/supremeAdminVerifyToken")

/*------------------SUPREMEADMIN CREDENTIAL------------------------- */
const {createSupremeAdmin, loginSupremeAdmin, getSupremeAdminById,updateSupremeAdmin, deleteSupremeAdmin  , logoutSupremeAdmin} = require('./../controllers/supremeAdmin/supremeAdminController');

/*---------------------MANAGE PROJECT-------------------------------- */
const {createProject, getAllProjects, getProjectById, updateProject, deleteProject,} = require("../controllers/supremeAdmin/manageProjectController");

/*----------------------MANAGE STAFF---------------------------------------- */
const  {createStaff , getAllStaff}  = require("../controllers/supremeAdmin/manageStaffController");

/*---------------------MANAGE PROJECT REMINDER----------------------------- */
const { createProjectReminder, getAllProjectsReminder, getProjectReminderById, updateProjectReminder,deleteProjectReminder,} = require("../controllers/supremeAdmin/manageReminderController")

/*---------------------MANAGE INCOME EXPENSE----------------------------- */
const { createExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense,} = require("../controllers/supremeAdmin/manageExpenseController")

/*------------------MANAGE ATTENDENCE---------------------------------------- */
const {  markAttendance, bulkSaveAttendance, getAllAttendance, filterAttendance, deleteAttendance,} = require("../controllers/supremeAdmin/manageAttendenceController")

/* --------------------------SupremeAdmin------------------------------ */
// ✅ Create Supreme Admin
router.post('/create', createSupremeAdmin);

// ✅ Login Supreme Admin
router.post('/login', loginSupremeAdmin);

// ✅ Get Supreme Admin by ID
router.get('/getSupremeAdmin/:supremeAdmin_id', getSupremeAdminById);

// ✅ Update Supreme Admin
router.put('/:supremeAdmin_id', updateSupremeAdmin);

// ✅ Delete Supreme Admin by ID
router.delete('/:supremeAdmin_id', deleteSupremeAdmin);

// ✅ Logout Supreme Admin
router.post('/logout', logoutSupremeAdmin);

/*-----------------------------Manage Staff------------------------------------------- */

// 🔹 POST 
router.post("/createStaff", createStaff);

// 🔹 GET 
router.get("/getAllStaff", getAllStaff);


/*-----------------------------Manage Project---------------------------------------- */


// 🔹 Create a new project
router.post("/createProject", createProject);

// 🔹 Get all projects
router.get("/getProjects", getAllProjects);

// 🔹 Get a project by ID
router.get("/getProjectById/:id", getProjectById);

// 🔹 Update a project by ID
router.put("/updateProject/:id", updateProject);

// 🔹 Delete a project by ID
router.delete("/deleteProject/:id", deleteProject);

/*-----------------------------Manage Reminder------------------------------------- */


// 🔹 Create a new project
router.post("/createProjecReminder", createProjectReminder);

// 🔹 Get all projects
router.get("/getProjectReminder", getAllProjectsReminder);

// 🔹 Get project by Mongo ID
router.get("/getProjectReminder/:id", getProjectReminderById);

// 🔹 Update project by ID
router.put("/updateProjectReminder/:id", updateProjectReminder);

// 🔹 Delete project by ID
router.delete("deleteProjectReminder/:id", deleteProjectReminder);



/*------------------MANAGE INCOME EXPENSE------------------------------- */

// 🔹 Create new expense
router.post("/createExpense", createExpense);

// 🔹 Get all expenses
router.get("/getExpense", getAllExpenses);

// 🔹 Get expense by ID
router.get("/getExpenseById/:id", getExpenseById);

// 🔹 Update expense by ID
router.put("/updateExpense/:id", updateExpense);

// 🔹 Delete expense by ID
router.delete("/deleteExpense/:id", deleteExpense);


/*--------------------------MANAGE ATTENDENCE------------------------------------ */

// ➕ Mark single attendance
router.post("/mark-attendence",supremeAdminVerifyToken, markAttendance);

// 📦 Bulk save attendance (from frontend form or import)
router.post("/bulk-attendence",supremeAdminVerifyToken, bulkSaveAttendance);

// 📋 Get all attendance records
router.get("/fetch-attendence",supremeAdminVerifyToken, getAllAttendance);

// 🔍 Filter attendance by date/staff/status
router.post("/filter-attendence/:supremeAdmin_id", filterAttendance);

// ❌ Delete an attendance record by ID
router.delete("/delete-attendence/:id", deleteAttendance);


module.exports = router;

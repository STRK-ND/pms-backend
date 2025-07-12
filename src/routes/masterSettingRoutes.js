const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,

  addPriority,
  getPriorities,
  updatePriority,
  deletePriority,

  addPriceType,
  getPriceTypes,
  updatePriceType,
  deletePriceType,

  addSalary,
  getSalaries,
  updateSalary,
  deleteSalary,
} = require("../controllers/supremeAdmin/masterSettingController");

/*--------------------------------------------------------------------- */
// 🟦 Category Routes
router.post("/createCategories", addCategory);
router.get("/getCategories", getCategories);
router.put("/categories/:category_id", updateCategory);
router.delete("/deleteCategories/:category_id", deleteCategory);
/*-------------------------------------------------------------------- */
// 🟥 Priority Routes
router.post("/createPriorities", addPriority);
router.get("/getPriorities", getPriorities);
router.put("/priorities/:priority_id", updatePriority);
router.delete("/priorities/:priority_id", deletePriority);
/*----------------------------------------------------------------------- */

// 🟨 Price Type Routes
router.post("/pricetypes", addPriceType);
router.get("/pricetypes", getPriceTypes);
router.put("/pricetypes/:priceType_id", updatePriceType);
router.delete("/pricetypes/:priceType_id", deletePriceType);
/*---------------------------------------------------------------------- */

// ➕ Create a new salary payout type
router.post("/createSalaries", addSalary);

// 📥 Get all salary payout types
router.get("/getSalaries", getSalaries);

// ♻️ Update a salary payout type by ID
router.put("/updateSalaries/:salary_id", updateSalary);

// ❌ Delete a salary payout type by ID
router.delete("/deleteSalaries/:salary_id", deleteSalary);
/*---------------------------------------------------------------------------- */

module.exports = router;

const MasterSetting = require("../../models/masterSettingSchema");
const logger = require("../../config/logger");

const getMaster = async () => {
  let master = await MasterSetting.findOne();
  if (!master) {
    master = await new MasterSetting().save();
  }
  return master;
};

/*----------------------------GENERATE ID----------------------------- */

const generateId = (prefix, list, field) => {
  const max = list.reduce((acc, item) => {
    const num = parseInt(item[field]?.split("_")[1]) || 0;
    return Math.max(acc, num);
  }, 0);
  return `${prefix}_${String(max + 1).padStart(3, "0")}`;
};

/*--------------------------CATEGORY SECTION------------------------------ */
// 🟦 Category
const addCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const master = await getMaster();
    const category_id = generateId("CAT", master.categories, "category_id");

    master.categories.push({ category_id, name, status });
    await master.save();

    res
      .status(201)
      .json({ message: "Category added", data: master.categories });
  } catch (err) {
    logger.error(`Add category failed: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const master = await getMaster();
    res.json({ data: master.categories });
  } catch (err) {
    logger.error(`Get category failed: ${err.message}`);

    res.status(500).json({ message: "Server error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { name, status } = req.body;
    const master = await getMaster();
    const item = master.categories.find((c) => c.category_id === category_id);
    if (!item) return res.status(404).json({ message: "Category not found" });

    item.name = name ?? item.name;
    item.status = status ?? item.status;

    await master.save();
    res.json({ message: "Category updated", data: item });
  } catch (err) {
    logger.error(`Updated category failed: ${err.message}`);

    res.status(500).json({ message: "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const master = await getMaster();
    master.categories = master.categories.filter(
      (c) => c.category_id !== category_id
    );
    await master.save();

    res.json({ message: "Category deleted" });
  } catch (err) {
    logger.error(`Delete category failed: ${err.message}`);

    res.status(500).json({ message: "Server error" });
  }
};

/*----------------------------PRIORIY SECTION---------------------------- */

// 🟥 Priority (same pattern)
const addPriority = async (req, res) => {
  try {
    const { name, status } = req.body;
    const master = await getMaster();
    const priority_id = generateId("PRY", master.priorities, "priority_id");

    master.priorities.push({ priority_id, name, status });
    await master.save();

    res
      .status(201)
      .json({ message: "Priority added", data: master.priorities });
  } catch (err) {
    logger.error(`Add Priority failed: ${err.message}`);

    res.status(500).json({ message: "Server error" });
  }
};

const getPriorities = async (req, res) => {
  try {
    const master = await getMaster();

    logger?.info("📋 Priorities fetched successfully");

    res.status(200).json({
      success: true,
      message: "Priorities retrieved successfully",
      data: master.priorities,
    });
  } catch (err) {
    logger?.error(`❌ Get priorities error: ${err.message}`, {
      stack: err.stack,
    });

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updatePriority = async (req, res) => {
  try {
    const { priority_id } = req.params;
    const { name, status } = req.body;

    const master = await getMaster();
    const item = master.priorities.find((p) => p.priority_id === priority_id);

    if (!item) {
      logger?.warn(`⚠️ Priority not found: ${priority_id}`);
      return res.status(404).json({
        success: false,
        message: "Priority not found",
      });
    }

    item.name = name ?? item.name;
    item.status = status ?? item.status;
    await master.save();

    logger?.info(`✅ Priority updated: ${priority_id}`);

    res.status(200).json({
      success: true,
      message: "Priority updated successfully",
      data: item,
    });
  } catch (err) {
    logger?.error(`❌ Update priority error: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deletePriority = async (req, res) => {
  try {
    const { priority_id } = req.params;
    const master = await getMaster();

    const initialCount = master.priorities.length;
    master.priorities = master.priorities.filter(
      (p) => p.priority_id !== priority_id
    );

    if (master.priorities.length === initialCount) {
      logger?.warn(`⚠️ Priority not found: ${priority_id}`);
      return res.status(404).json({
        success: false,
        message: "Priority not found",
      });
    }

    await master.save();

    logger?.info(`🗑️ Priority deleted: ${priority_id}`);
    res.status(200).json({
      success: true,
      message: "Priority deleted successfully",
    });
  } catch (err) {
    logger?.error(`❌ Delete priority error: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*------------------------------PRICE TYPE SECTION------------------------------- */

// 🟨 PriceType (same pattern)
const addPriceType = async (req, res) => {
  try {
    const { name, status } = req.body;
    const master = await getMaster();
    const priceType_id = generateId("PTYPE", master.pricetypes, "priceType_id");

    master.pricetypes.push({ priceType_id, name, status });
    await master.save();

    res
      .status(201)
      .json({ message: "Price type added", data: master.pricetypes });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getPriceTypes = async (req, res) => {
  try {
    const master = await getMaster();
    res.json({ data: master.pricetypes });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updatePriceType = async (req, res) => {
  try {
    const { priceType_id } = req.params;
    const { name, status } = req.body;
    const master = await getMaster();
    const item = master.pricetypes.find((p) => p.priceType_id === priceType_id);
    if (!item) return res.status(404).json({ message: "Price type not found" });

    item.name = name ?? item.name;
    item.status = status ?? item.status;
    await master.save();

    res.json({ message: "Price type updated", data: item });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deletePriceType = async (req, res) => {
  try {
    const { priceType_id } = req.params;
    const master = await getMaster();
    master.pricetypes = master.pricetypes.filter(
      (p) => p.priceType_id !== priceType_id
    );
    await master.save();

    res.json({ message: "Price type deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/*----------------------SALERY PAY OUT SECTION------------------------ */

// 🟦 Salery Pay Out
const addSalary = async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const master = await getMaster();

    // Ensure master.salaries exists
    if (!master.salaries) master.salaries = [];

    // Auto-generate salary_id
    const salary_id = generateId("SALP", master.salaries, "salary_id");

    master.salaries.push({ salary_id, name, status });

    await master.save();

    logger?.info(`💰 Salary payout type added: ${name}`);

    res.status(201).json({
      success: true,
      message: "Salary payout type added successfully",
      data: master.salaries,
    });
  } catch (error) {
    logger?.error(`❌ Add salary error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSalaries = async (req, res) => {
  try {
    const master = await getMaster();

    logger?.info("📄 Salaries fetched successfully");

    res.status(200).json({
      success: true,
      message: "Salary payout types retrieved successfully",
      data: master.salaries,
    });
  } catch (err) {
    logger?.error(`❌ Get salaries error: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateSalary = async (req, res) => {
  try {
    const { salary_id } = req.params;
    const { name, status } = req.body;

    const master = await getMaster();
    const item = master.salaries?.find((s) => s.salary_id === salary_id);

    if (!item) {
      logger?.warn(`⚠️ Salary not found: ${salary_id}`);
      return res.status(404).json({
        success: false,
        message: "Salary payout type not found",
      });
    }

    item.name = name ?? item.name;
    item.status = status ?? item.status;

    await master.save();

    logger?.info(`✅ Salary updated: ${salary_id}`);
    res.status(200).json({
      success: true,
      message: "Salary payout type updated successfully",
      data: item,
    });
  } catch (err) {
    logger?.error(`❌ Update salary error: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteSalary = async (req, res) => {
  try {
    const { salary_id } = req.params;
    const master = await getMaster();

    const before = master.salaries?.length || 0;
    master.salaries = master.salaries?.filter((s) => s.salary_id !== salary_id);

    if (before === master.salaries?.length) {
      logger?.warn(`⚠️ Salary not found: ${salary_id}`);
      return res.status(404).json({
        success: false,
        message: "Salary payout type not found",
      });
    }

    await master.save();

    logger?.info(`🗑️ Salary deleted: ${salary_id}`);
    res.status(200).json({
      success: true,
      message: "Salary payout type deleted successfully",
    });
  } catch (err) {
    logger?.error(`❌ Delete salary error: ${err.message}`, {
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
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
};

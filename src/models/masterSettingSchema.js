const mongoose = require("mongoose");

// Category Subschema
const ManageCategory = new mongoose.Schema({
  category_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

// Priority Subschema
const ManagePriority = new mongoose.Schema({
  priority_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

// Price Type Subschema
const ManagePriceType = new mongoose.Schema({
  priceType_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

// Salery Pay Out

const SaleryPayOut = new mongoose.Schema({
  salary_id:{
    type: String,
    required: true,
    unique: true
  },
  name:{
    type: String,
    required: true,
    
  },
  status:{
    type: String,
    enum:["active" , "inactive"],
    default:"active"
  }

})


// Master Setting Schema
const MasterSettingSchema = new mongoose.Schema(
  {
    categories: [ManageCategory],
    priorities: [ManagePriority],
    pricetypes: [ManagePriceType],
    salaries: [SaleryPayOut],

  },
  { timestamps: true }
);

const MasterSetting = mongoose.model("Master Setting", MasterSettingSchema);
module.exports = MasterSetting;

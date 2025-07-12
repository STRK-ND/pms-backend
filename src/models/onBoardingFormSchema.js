const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      required: true,
      unique: true,
    },
    employeeName: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
    doj: {
      type: String,
      required: [true, "Date of joining is required"],
    },
    department: {
      type: String,
      default: "Quality Assurance",
    },
    dob: {
      type: String,
      required: [true, "Date of birth is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    uanNo: String,
    joiningLocation: String,
    panNo: String,
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    aadharNo: String,
    presentAddress: String,
    permanentAddress: String,
    annualCtc: String,
    maritalStatus: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },

    spouseName: String,
    previousPfNumber: {
      type: String,
      default: "Yes",
    },
    epfSalary: String,
    esiNo: String,
    esicDispensary: String,
    nomineeName: String,
    nomineeDob: String,
    nomineeAadhar: String,
    nomineeRelation: String,
    fatherName: String,
    husbandName: String,
    nameInBank: String,
    bankAccountNumber: String,
    bankName: String,
    branchName: String,
    ifscCode: String,
  },
  { timestamps: true }
);

const employee = mongoose.model("Employee OnBordingForm", employeeSchema);
module.exports = employee;

const mongoose = require("mongoose"); 
const employeeSchema = new mongoose.Schema({
     employeeName: { type: String, required: true }, 
     department: { type: String, required: true }, 
     position: { type: String },
      computerType: { type: String }, 
      status: { type: String, enum: ["pending", "in_progress", "completed"],
         default: "pending" },
          assignedTechnician: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }, { timestamps: true }); module.exports = mongoose.model("Employee", employeeSchema);
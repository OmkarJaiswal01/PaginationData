const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const APiModel = require('./Model/ApiModel');
const SalleryModel=require('./Model/SalleryModel');
const jwt = require('jsonwebtoken');
const  localStorage=require('local-storage')
app.use(express.json());
app.use(cors());

const db = mongoose.connect("mongodb://127.0.0.1:27017/UserFormData");
db.then(() => {
    console.log("Database is connected");
}).catch(() => {
    console.log("Database is not connected");
});

app.post("/User", async (req, res) => {
    const { name, email, phone, address, grade, pass, gender } = req.body;
    const model = new APiModel({ name, email, phone, address, grade, pass, gender });

    try {
        const data = await model.save();
        res.status(200).json({
            message: "Data Saved",
            data,
            Error: false,
            Success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Error saving data",
            Error: true,
            Success: false
        });
    }
});




const handleLogin = async (req, res) => {
    const { name, pass } = req.body;
    const grade = req.query.grade;
  
    try {
      let userQuery = {
        $or: [
          { name: name },
          { email: name },
          { phone: name }
        ],
        pass: pass
      };
  
      const user = await APiModel.findOne(userQuery);
  
      if (!user) {
        return res.status(401).json({ message: "Login failed" });
      }
  
      // Fetch grade information only if grade is specified
      let gradeInfo = {};
      if (grade) {
        const gradeData = await SalleryModel.findOne({ grade: grade });
        if (!gradeData) {
          return res.status(404).json({ message: `Grade information for grade ${grade} not found` });
        }
        gradeInfo = { grade: gradeData.grade, salary: gradeData.salary }; // Adjust fields according to your schema
      }
  
      res.status(200).json({ message: "Login successful", user, grade: gradeInfo });
      console.log(user,{grade: gradeInfo.salary
 });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  app.post("/login", handleLogin);


  
  app.get('/grade/:id',async(req,res)=>{
    const grade=req.params.id;
    const gradeData = await SalleryModel.findOne({ grade: grade });
     res.send(gradeData ) 
})






app.get("/payscal", async (req, res) => {
    const grade = req.query.grade;

    try {
        let query = {};

        if (grade) {
            query = { "grades.grade": grade };
        }

        const salaries = await SalleryModel.find(query);

        if (salaries.length > 0) {
            res.json(salaries);
        } else {
            res.status(404).json({ message: `Salaries for grade ${grade} not found` });
        }
    } catch (error) {
        console.error("Error fetching salaries:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});







// Combined next/previous route
app.get("/data", async (req, res) => {
  const { page } = req.query;
  const pageNumber = parseInt(page) || 1; // Parse the page parameter to an integer, defaulting to page 1 if not provided
  const pageSize = 1; // Set the page size to 1 to retrieve one data at a time
  const skipAmount = (pageNumber - 1) * pageSize; // Calculate the amount to skip based on the page number

  try {
    const data = await APiModel.find().skip(skipAmount).limit(pageSize);
    const data1 = await APiModel.find();
    const salaries = await SalleryModel.findOne({grade:data[0]?.grade});
   const resData= {
      _id: data[0]._id,
      name: data[0].name,
      email: data[0].email,
      phone: data[0].phone,
      address: data[0].address,
      grade: data[0].grade,
      gender: data[0].gender,
      salaries:  parseInt(salaries?.salary) + parseInt(salaries?.TA) + parseInt(salaries?.DA),
      dataLenght:data1.length
    }
    res.json(resData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




app.listen(9000, () => {
    console.log("server started");
});

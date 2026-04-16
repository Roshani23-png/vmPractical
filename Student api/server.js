const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.error(err));

// Student Schema (Practical-7)
const studentSchema = new mongoose.Schema({
    id: Number,
    name: String,
    dept: String,
    city: String,
    age: Number
});
const Student = mongoose.model('Student', studentSchema);

// 1. READ: Saare students dekhna (GET)
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// 2. CREATE: Naya student add karna (POST)
app.post('/api/students', async (req, res) => {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json({ message: "Student Added!" });
});



// DELETE: Student remove karne ke liye
app.delete('/api/students/:id', async (req, res) => {
    await Student.deleteOne({ id: req.params.id });
    res.json({ message: "Student Deleted!" });
});

// UPDATE: Student ki details badalne ke liye (Age update example)
app.put('/api/students/:id', async (req, res) => {
    await Student.updateOne({ id: req.params.id }, { $set: req.body });
    res.json({ message: "Student Updated!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
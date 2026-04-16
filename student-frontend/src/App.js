import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Inline CSS Styles for a modern UI
const styles = {
  container: {
    padding: '40px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f7f6',
    minHeight: '100vh',
  },
  title: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2.5rem',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '1rem',
  },
  button: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginRight: '10px',
  },
  addBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
  },
  updateBtn: {
    backgroundColor: '#2980b9',
    color: 'white',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  editBtn: {
    backgroundColor: '#3498db',
    color: 'white',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px',
    textAlign: 'left',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #ddd',
  },
};

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', dept: '', city: '', age: '' });
  const [isEditing, setIsEditing] = useState(false); // Check if we are adding or updating

  const URL = 'https://vmpractical-1.onrender.com/api/students';

  const fetchData = () => {
    axios.get(URL).then(res => setStudents(res.data)).catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add New Student (CREATE - Practical 9)
  const addStudent = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dept || !formData.age) {
      alert("Please fill all mandatory fields (Name, Dept, Age)");
      return;
    }
    axios.post(URL, formData)
      .then(() => {
        fetchData(); // Refresh list
        setFormData({ id: '', name: '', dept: '', city: '', age: '' }); // Clear form
        alert("Student Added Successfully!");
      })
      .catch(err => alert("Error adding student: " + err));
  };

  // Pre-fill form for Editing (Part of Practical 9)
  const startEdit = (student) => {
    setIsEditing(true);
    setFormData(student); // Load student data into form
  };

  // Update Existing Student (UPDATE - Practical 9)
  const updateStudent = (e) => {
    e.preventDefault();
    axios.put(`${URL}/${formData.id}`, formData)
      .then(() => {
        fetchData();
        setIsEditing(false); // Back to Add mode
        setFormData({ id: '', name: '', dept: '', city: '', age: '' });
        alert("Student Updated Successfully!");
      })
      .catch(err => alert("Error updating student: " + err));
  };

  // Delete Student (DELETE - Practical 5 Management)
  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      axios.delete(`${URL}/${id}`)
        .then(() => {
          fetchData();
          alert("Student Deleted.");
        })
        .catch(err => alert("Error deleting student: " + err));
    }
  };

  // Cancel Editing mode
  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({ id: '', name: '', dept: '', city: '', age: '' });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Cloud Student Management</h1>

      {/* Modern Form Card (Practical 9) */}
      <div style={styles.formCard}>
        <h3>{isEditing ? "Update Student Details" : "Add New Student"}</h3>
        <form onSubmit={isEditing ? updateStudent : addStudent}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            {/* Show ID input only when adding new, or disable when editing */}
            <input name="id" type="number" value={formData.id} onChange={handleChange} placeholder="Unique ID (e.g. 11)" style={styles.input} disabled={isEditing} />
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" style={styles.input} required />
            <input name="dept" value={formData.dept} onChange={handleChange} placeholder="Department (e.g. Computer)" style={styles.input} required />
            <input name="city" value={formData.city} onChange={handleChange} placeholder="City (Optional)" style={styles.input} />
            <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" style={styles.input} required />
          </div>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            {isEditing ? (
              <>
                <button type="submit" style={{ ...styles.button, ...styles.updateBtn }}>Update Student</button>
                <button type="button" onClick={cancelEdit} style={styles.button}>Cancel</button>
              </>
            ) : (
              <button type="submit" style={{ ...styles.button, ...styles.addBtn }}>Add Student to Cloud</button>
            )}
          </div>
        </form>
      </div>

      {/* Styled Students Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>City</th>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => (
            <tr key={s.id} style={index % 2 === 0 ? {} : {backgroundColor: '#f9f9f9'}}>
              <td style={styles.td}>{s.id}</td>
              <td style={styles.td}>{s.name}</td>
              <td style={styles.td}>{s.dept}</td>
              <td style={styles.td}>{s.city}</td>
              <td style={styles.td}>{s.age}</td>
              <td style={styles.td}>
                <button onClick={() => startEdit(s)} style={{ ...styles.button, ...styles.editBtn, padding: '8px 15px', fontSize: '0.9rem' }}>Edit All</button>
                <button onClick={() => deleteStudent(s.id)} style={{ ...styles.button, ...styles.deleteBtn, padding: '8px 15px', fontSize: '0.9rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

import React, { useState } from "react";

interface Class {
  id: number;
  name: string;
  subject: string;
}

interface ClassTableProps {
  classes: Class[];
  onAdd: (newClass: { name: string; subject: string }) => void;
  onEdit: (id: number, updatedClass: { name: string; subject: string }) => void;
  onDelete: (id: number) => void;
}

const ClassTable: React.FC<ClassTableProps> = ({ classes, onAdd, onEdit, onDelete }) => {
  const [newClass, setNewClass] = useState({ name: "", subject: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: value });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClass.name && newClass.subject) {
      onAdd(newClass);
      setNewClass({ name: "", subject: "" });
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id}>
              <td>{cls.id}</td>
              <td>{cls.name}</td>
              <td>{cls.subject}</td>
              <td>
                <button onClick={() => onEdit(cls.id, cls)}>Edit</button>
                <button onClick={() => onDelete(cls.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Class</h2>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          name="name"
          placeholder="Class Name"
          value={newClass.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={newClass.subject}
          onChange={handleInputChange}
        />
        <button type="submit">Add Class</button>
      </form>
    </div>
  );
};

export default ClassTable;

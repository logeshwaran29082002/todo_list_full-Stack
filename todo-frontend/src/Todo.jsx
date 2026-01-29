import React, { useState, useEffect } from "react";

function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiurl = "http://localhost:3000";

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiurl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  const handleSubmit = () => {
    setError("");

    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiurl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            const newTodo = { title, description }; // Optional: get full item from backend
            setTodos([...todos, newTodo]);
            setSuccess("Item added successfully!");
            setTitle("");
            setDescription("");
            setTimeout(() => setSuccess(""), 3000);
          } else {
            setError("Failed to add item. Please try again.");
          }
        })
        .catch(() => {
          setError("Failed to connect to the server.");
        });
    } else {
      setError("Both fields are required.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleEditCancel = () => {
    setEditId(-1);
    setEditTitle("");
    setEditDescription("");
  };

  const handleUpdate = () => {
    setError("");

    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiurl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) =>
              item._id === editId
                ? { ...item, title: editTitle, description: editDescription }
                : item
            );
            setTodos(updatedTodos);
            setSuccess("Item updated successfully!");
            setEditId(-1);
            setEditTitle("");
            setEditDescription("");
            setTimeout(() => setSuccess(""), 3000);
          } else {
            setError("Failed to update item. Please try again.");
          }
        })
        .catch(() => {
          setError("Failed to connect to the server.");
        });
    } else {
      setError("Both fields are required.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(apiurl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  return (
    <div className="container-fluid vh-100 overflow-auto bg-light">
      <div className="row p-3 bg-success text-light">
        <h1>Todo List</h1>
      </div>

      <div className="row p-4">
        <h3>Add Items</h3>
        {success && <p className="text-success">{success}</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="form-group d-flex gap-2 flex-wrap">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="form-control"
            style={{ maxWidth: "300px" }}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            className="form-control"
            style={{ maxWidth: "300px" }}
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      <div className="row mt-3 px-4">
        <h3 className="mb-3">Tasks</h3>
        <ul className="list-group w-100">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-white border shadow-sm d-flex justify-content-between align-items-center my-2"
            >
              <div className="d-flex flex-column">
                {editId === item._id ? (
                  <>
                    <input
                      placeholder="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      type="text"
                      className="form-control mb-2"
                      style={{ maxWidth: "300px" }}
                    />
                    <input
                      placeholder="Description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      type="text"
                      className="form-control"
                      style={{ maxWidth: "300px" }}
                    />
                  </>
                ) : (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span>{item.description}</span>
                  </>
                )}
              </div>

              <div className="d-flex gap-2">
                {editId === item._id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todo;

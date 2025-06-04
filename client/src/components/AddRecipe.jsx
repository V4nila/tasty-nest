import React, { useState } from "react";
import axios from "axios";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [focusFields, setFocusFields] = useState({});
  const [btnHover, setBtnHover] = useState(false);

  const handleFocus = (field) => {
    setFocusFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusFields((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("ingredients", ingredients);
      formData.append("instructions", instructions);
      formData.append("tags", tags);
      formData.append("image", imageFile);

      await axios.post("http://localhost:3000/api/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage("Recipe added successfully!");
      setTitle("");
      setIngredients("");
      setInstructions("");
      setTags("");
      setImageFile(null);
    } catch (error) {
      setMessage("Failed to add recipe. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New Recipe</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              ...styles.input,
              ...(focusFields.title ? styles.inputFocus : {}),
            }}
            onFocus={() => handleFocus("title")}
            onBlur={() => handleBlur("title")}
          />
        </label>

        <label style={styles.label}>
          Ingredients (comma-separated)
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            style={{
              ...styles.input,
              height: "80px",
              resize: "vertical",
              ...(focusFields.ingredients ? styles.inputFocus : {}),
            }}
            onFocus={() => handleFocus("ingredients")}
            onBlur={() => handleBlur("ingredients")}
          />
        </label>

        <label style={styles.label}>
          Instructions
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            style={{
              ...styles.input,
              height: "120px",
              resize: "vertical",
              ...(focusFields.instructions ? styles.inputFocus : {}),
            }}
            onFocus={() => handleFocus("instructions")}
            onBlur={() => handleBlur("instructions")}
          />
        </label>

        <label style={styles.label}>
          Tags (comma-separated)
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{
              ...styles.input,
              ...(focusFields.tags ? styles.inputFocus : {}),
            }}
            onFocus={() => handleFocus("tags")}
            onBlur={() => handleBlur("tags")}
          />
        </label>

        <label style={styles.label}>
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={styles.input}
          />
        </label>

        <button
          type="submit"
          style={{
            ...styles.submitBtn,
            ...(btnHover ? styles.submitBtnHover : {}),
          }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Recipe"}
        </button>

        {message && (
          <p
            style={
              message.includes("Failed")
                ? styles.messageError
                : styles.messageSuccess
            }
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px 35px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#2c3e50",
    fontWeight: "700",
    fontSize: "1.9rem",
    letterSpacing: "1.2px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "20px",
    fontWeight: "600",
    color: "#34495e",
  },
  input: {
    marginTop: "8px",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #ccc",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.3s ease",
  },
  inputFocus: {
    borderColor: "#27ae60",
    boxShadow: "0 0 8px rgba(39, 174, 96, 0.4)",
  },
  submitBtn: {
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "700",
    marginTop: "25px",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  submitBtnHover: {
    backgroundColor: "#219150",
    transform: "scale(1.05)",
  },
  messageSuccess: {
    marginTop: "20px",
    fontWeight: "700",
    textAlign: "center",
    color: "#27ae60",
  },
  messageError: {
    marginTop: "20px",
    fontWeight: "700",
    textAlign: "center",
    color: "#e74c3c",
  },
}; 

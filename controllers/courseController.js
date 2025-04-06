// controllers/courseController.js

const pool = require("../db");

// Obtener todos los cursos
exports.getAllCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM course ORDER BY start_date");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    res.status(500).json({ error: "Error al obtener los cursos" });
  }
};

// Obtener un curso por ID
exports.getCourseById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM course WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    res.status(500).json({ error: "Error al obtener el curso" });
  }
};

// Crear un nuevo curso
exports.createCourse = async (req, res) => {
  const { title, start_date, end_date, description, category } = req.body;

  if (!title || !start_date || !end_date) {
    return res
      .status(400)
      .json({
        error: "Título, fecha de inicio y fecha de cierre son obligatorios",
      });
  }

  try {
    const result = await pool.query(
      "INSERT INTO course (title, start_date, end_date, description, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, start_date, end_date, description, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear el curso:", error);
    res.status(500).json({ error: "Error al crear el curso" });
  }
};

// Actualizar un curso existente
exports.updateCourse = async (req, res) => {
  const { title, start_date, end_date, description, category } = req.body;
  const courseId = req.params.id;

  if (!title || !start_date || !end_date) {
    return res
      .status(400)
      .json({
        error: "Título, fecha de inicio y fecha de cierre son obligatorios",
      });
  }

  try {
    const checkResult = await pool.query("SELECT * FROM course WHERE id = $1", [
      courseId,
    ]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const updateResult = await pool.query(
      "UPDATE course SET title = $1, start_date = $2, end_date = $3, description = $4, category = $5 WHERE id = $6 RETURNING *",
      [title, start_date, end_date, description, category, courseId]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    res.status(500).json({ error: "Error al actualizar el curso" });
  }
};

// Eliminar un curso
exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    const checkResult = await pool.query("SELECT * FROM course WHERE id = $1", [
      courseId,
    ]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    await pool.query("DELETE FROM course WHERE id = $1", [courseId]);

    res.json({ message: "Curso eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el curso:", error);
    res.status(500).json({ error: "Error al eliminar el curso" });
  }
};

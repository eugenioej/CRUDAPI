const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Rutas
const countryRoutes = require("./routes/countryRoutes");
const courseRoutes = require("./routes/courseRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3100;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/countries", countryRoutes);
app.use("/api/courses", courseRoutes);

// Ruta de inicio
app.get("/", (req, res) => {
  res.send("🌍 API funcionando: Países y Cursos conectados a PostgreSQL");
});

// Manejo de errores básicos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

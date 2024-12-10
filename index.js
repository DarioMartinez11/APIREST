/**
 * Tres formas de almacenar valores en memoria en JavaScript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Definimos una estructura de datos inicial
let concesionarios = [
  {
    id: 1,
    nombre: "Concesionario A",
    direccion: "Calle Falsa 123",
    coches: [
      { id: 1, modelo: "Renault Clio", cv: 90, precio: 15000 },
      { id: 2, modelo: "Nissan Skyline R34", cv: 280, precio: 50000 },
    ],
  },
];

// Endpoints para gestionar concesionarios
app.get("/concesionarios", (req, res) => {
  res.json(concesionarios);
});

app.post("/concesionarios", (req, res) => {
  const nuevoConcesionario = { id: Date.now(), ...req.body, coches: [] };
  concesionarios.push(nuevoConcesionario);
  res.json({
    message: "Concesionario creado",
    concesionario: nuevoConcesionario,
  });
});

app.get("/concesionarios/:id", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });
  res.json(concesionario);
});

app.put("/concesionarios/:id", (req, res) => {
  const index = concesionarios.findIndex(
    (c) => c.id === parseInt(req.params.id)
  );
  if (index === -1)
    return res.status(404).json({ message: "Concesionario no encontrado" });
  concesionarios[index] = { ...concesionarios[index], ...req.body };
  res.json({
    message: "Concesionario actualizado",
    concesionario: concesionarios[index],
  });
});

app.delete("/concesionarios/:id", (req, res) => {
  concesionarios = concesionarios.filter(
    (c) => c.id !== parseInt(req.params.id)
  );
  res.json({ message: "Concesionario eliminado" });
});

// Endpoints para gestionar coches dentro de concesionarios
app.get("/concesionarios/:id/coches", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });
  res.json(concesionario.coches);
});

app.post("/concesionarios/:id/coches", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });
  const nuevoCoche = { id: Date.now(), ...req.body };
  concesionario.coches.push(nuevoCoche);
  res.json({ message: "Coche añadido", coche: nuevoCoche });
});

app.get("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });
  const coche = concesionario.coches.find(
    (c) => c.id === parseInt(req.params.cocheId)
  );
  if (!coche) return res.status(404).json({ message: "Coche no encontrado" });
  res.json(coche);
});

app.put("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });
  const cocheIndex = concesionario.coches.findIndex(
    (c) => c.id === parseInt(req.params.cocheId)
  );
  if (cocheIndex === -1)
    return res.status(404).json({ message: "Coche no encontrado" });
  concesionario.coches[cocheIndex] = {
    ...concesionario.coches[cocheIndex],
    ...req.body,
  };
  res.json({
    message: "Coche actualizado",
    coche: concesionario.coches[cocheIndex],
  });
});

app.delete("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });
  concesionario.coches = concesionario.coches.filter(
    (c) => c.id !== parseInt(req.params.cocheId)
  );
  res.json({ message: "Coche eliminado" });
});

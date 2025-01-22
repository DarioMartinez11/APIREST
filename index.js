// Importamos las bibliotecas necesarias.
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Inicializamos la aplicación
const app = express();

//APP swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Configuración de conexión con MongoDB
const uri = "mongodb+srv://dariomvila:Gws4mrpD07ecdqM1@cluster0.3gxun.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db("Cluster0");
    console.log("Conectado a la base de datos MongoDB");
  } catch (error) {
    console.error("Error conectando a MongoDB", error);
    process.exit(1);
  }
}

connectToDatabase();

// Endpoints para gestionar concesionarios
app.get("/concesionarios", async (req, res) => {
  try {
    const concesionarios = await db.collection("concesionarios").find().toArray();
    res.json(concesionarios);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo concesionarios", error });
  }
});

app.post("/concesionarios", async (req, res) => {
  try {
    const { nombre, direccion, coches } = req.body;
    const nuevoConcesionario = { nombre, direccion, coches };
    const result = await db.collection("concesionarios").insertOne(nuevoConcesionario);
    res.json({ message: "Concesionario creado", concesionario: result });
  } catch (error) {
    res.status(500).json({ message: "Error creando concesionario", error });
  }
});

app.get("/concesionarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const concesionario = await db
      .collection("concesionarios")
      .findOne({ _id: objectId });
    if (!concesionario) return res.status(404).json({ message: "Concesionario no encontrado" });
    res.json(concesionario);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo concesionario", error });
  }
});

app.put("/concesionarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, coches } = req.body;
    const objectId = new ObjectId(id);
    const result = await db
      .collection("concesionarios")
      .findOneAndUpdate(
        { _id: objectId },
        { $set: { nombre, direccion, coches } }
      );
    if (!result) return res.status(404).json({ message: "Concesionario no encontrado" });
    res.json({ message: "Concesionario actualizado", concesionario: result });
  } catch (error) {
    res.status(500).json({ message: "Error actualizando concesionario", error });
  }
});

app.delete("/concesionarios/:id", async (req, res) => {
  try {
    const result = await db.collection("concesionarios").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Concesionario no encontrado" });
    res.json({ message: "Concesionario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando concesionario", error });
  }
});

// Endpoints para gestionar coches dentro de concesionarios
app.get("/concesionarios/:id/coches", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const concesionario = await db
      .collection("concesionarios")
      .findOne({ _id: objectId },{ projection: { coches: 1 } });
    if (!concesionario) return res.status(404).json({ message: "Concesionario no encontrado" });
    res.json(concesionario.coches);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo coches", error });
  }
});

app.post("/concesionarios/:id/coches", async (req, res) => {
  try {
    const { id } = req.params;
    const { modelo, cv, precio } = req.body;
    const nuevoCoche = { modelo, cv, precio };
    const objectId = new ObjectId(id)
    const result = await db
      .collection("concesionarios")
      .updateOne(
        { _id: objectId },
        { $push: { coches: nuevoCoche } }
      );
    if (!result) return res.status(404).json({ message: "Concesionario no encontrado" });
    res.json({ message: "Coche añadido", concesionario: nuevoCoche });
  } catch (error) {
    res.status(500).json({ message: "Error añadiendo coche", error });
  }
});

//cocheId. De get, put y delete.

app.get("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const { id , cocheId } = req.params;
    const objectId = new ObjectId(id);
    const concesionario = await client
      .db("Cluster0")
      .collection("concesionarios")
      .findOne({ _id: objectId },{ projection: { coches: 1 } });
      const cocheNum = parseInt(cocheId);
      const coche = concesionario.coches[cocheNum];
    if (!coche) return res.status(404).json({ message: "Concesionario o coche no encontrado" });
    res.json(coche);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo coche", error });
  }
});

app.put("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const { id , cocheId } = req.params;
    const objectId = new ObjectId(id);
    const concesionario = await db
    .collection("concesionarios")
    .findOne({ _id: objectId });
      const cocheNum = parseInt(cocheId);
      const coche = concesionario.coches[cocheNum];

      concesionario.coches[cocheNum] = {
        ...coche,
        ...req.body
      };
    const result = await db
      .collection("concesionarios")
      .updateOne(
        { _id: objectId },
        { $set: { coches: concesionario.coches } }
      );
    if (!result) return res.status(404).json({ message: "Concesionario o coche no encontrado" });
    res.json({ message: "Coche actualizado", coche:concesionario.coches [cocheNum] });
  } catch (error) {
    res.status(500).json({ message: "Error actualizando coche", error });
  }
});

app.delete("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const { id , cocheId } = req.params;
    const objectId = new ObjectId(id);
    const concesionario = await db
    .collection("concesionarios")
    .findOne({ _id: objectId });
      const cocheNum = parseInt(cocheId);
      const coche = concesionario.coches[cocheNum];

      concesionario.coches.splice(cocheNum, 1);
    const result = await db
      .collection("concesionarios")
      .updateOne(
        { _id: objectId },
        { $set: { coches: concesionario.coches } }
      );
    if (!result) return res.status(404).json({ message: "Concesionario o coche no encontrado" });
    res.json({ message: "Coche borrado",  cocheNum });
  } catch (error) {
    res.status(500).json({ message: "Error actualizando coche", error });
  }
});

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

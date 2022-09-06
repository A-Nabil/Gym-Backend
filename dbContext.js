const NodeCache = require("node-cache");
var config = require("./dbConfig");
const sql = require("mssql");

const myCache = new NodeCache({ stdTTL: 60 * 60 * 2 });

async function getOrders() {
  try {
    let pool = await sql.connect(config);
    let products = await pool
      .request()
      .query(
        "select [Id],muscles,Name,[difficulty],BodyParts,[Equipment],[excercise-gif],[ex-image],[ex-steps]   FROM [ExercisesDB].[dbo].[exercises]"
      );
    return products.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getMuscles() {
  try {
    if (myCache.has("muscles")) {
      return myCache.get("muscles");
    }
    let pool = await sql.connect(config);
    let muscles = await pool
      .request()
      .query("SELECT [Id],[Name] ,[name_en], [image_uri] FROM [dbo].[muscles]");

    myCache.set("muscles", muscles.recordsets);

    return muscles.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getWorkoutsByMuscleId(MuscleId) {
  try {
    if (myCache.has("muscleWorkouts" + MuscleId)) {
      return myCache.get("muscleWorkouts"+ MuscleId);
    }
    let pool = await sql.connect(config);
    let muscleWorkouts = await pool
      .request()
      .input("muscleId_parameter", sql.Int, MuscleId)
      .query(
        "SELECT * FROM [dbo].[exercises] where muscleId = @muscleId_parameter"
      );

    myCache.set("muscleWorkouts" + MuscleId, muscleWorkouts.recordsets);

    return muscleWorkouts.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getOrder(productId) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("input_parameter", sql.Int, productId)
      .query("SELECT * from Orders where Id = @input_parameter");
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getOrders: getOrders,
  getOrder: getOrder,
  getMuscles: getMuscles,
  getWorkoutsByMuscleId: getWorkoutsByMuscleId,
};

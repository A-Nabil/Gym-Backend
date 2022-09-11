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

async function getWorkoutsByMuscleId(MuscleId, isGym) {
  try {
    if (myCache.has("muscleWorkouts" + MuscleId + isGym)) {
      return myCache.get("muscleWorkouts" + MuscleId + isGym);
    }
    let pool = await sql.connect(config);
    let muscleWorkouts = await pool
      .request()
      .input("muscleId_parameter", sql.Int, MuscleId)
      .input("isGym_parameter", sql.Bit, isGym.toLowerCase() === "true")
      .query(
        "SELECT * FROM [dbo].[exercises] where muscleId = @muscleId_parameter and isGym = @isGym_parameter"
      );

    myCache.set("muscleWorkouts" + MuscleId + isGym, muscleWorkouts.recordsets);

    return muscleWorkouts.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function updateWorkout(name, isGym) {
  try {
    let pool = await sql.connect(config);
    let product = await pool
      .request()
      .input("workoutName", sql.NVarChar, name)
      .input("isGymParm", sql.Bit, isGym.toLowerCase() === "true")
      .query(
        "update exercises set isGym = @isGymParm where name = @workoutName"
      );
    return product.recordsets;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getOrders: getOrders,
  updateWorkout: updateWorkout,
  getMuscles: getMuscles,
  getWorkoutsByMuscleId: getWorkoutsByMuscleId,
};

var  config = require('./dbConfig');
const  sql = require('mssql');

async  function  getOrders() {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request().query("select [Id],muscles,Name,[difficulty],BodyParts,[Equipment],[excercise-gif],[ex-image],[ex-steps]   FROM [ExercisesDB].[dbo].[exercises]");
      return  products.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }

  async function getMuscles()
  {
    try {
      let  pool = await  sql.connect(config);
      let  muscles = await  pool.request().query("select distinct  muscle  FROM [ExercisesDB].[dbo].[exercises]");
      return  muscles.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }

  async  function  getOrder(productId) {
    try {
      let  pool = await  sql.connect(config);
      let  product = await  pool.request()
      .input('input_parameter', sql.Int, productId)
      .query("SELECT * from Orders where Id = @input_parameter");
      return  product.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }

  module.exports = {
    getOrders:  getOrders,
    getOrder:  getOrder,
    getMuscles : getMuscles
  }
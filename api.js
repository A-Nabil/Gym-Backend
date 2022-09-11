var Db = require("./dbContext");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const apiMetrics = require("prometheus-api-metrics");
var app = express();
var router = express.Router();

app.use(apiMetrics());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use("/api", router);

const appInsights = require("applicationinsights");
appInsights
  .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(false)
  .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
  .start();

router.use((request, response, next) => {
  console.log("middleware");
  next();
});

router.route("/orders").get((request, response) => {
  user: process.env.db_user;
  Db.getOrders().then((data) => {
    response.json(data[0]);
  });
});

router.route("/muscles").get((request, response) => {
  Db.getMuscles().then((data) => {
    response.json(data[0]);
  });
});

router.route("/workouts").get((request, response, next) => {
  if (!request.query.muscleId || !request.query.isGym) {
    const err = new Error(
      "Required params are missing" +
        request.query.muscleId +
        " muscleId: " +
        " isGym: " +
        request.query.isGym
    );
    err.status = 400;
    next(err);
    return;
  }
  Db.getWorkoutsByMuscleId(request.query.muscleId, request.query.isGym).then(
    (data) => {
      response.json(data[0]);
    }
  );
});

router.route("/workouts").post((request, response, next) => {
  if (!request.body.name || !request.body.isGym) {
    const err = new Error("Required body params missing");
    err.status = 400;
    next(err);
    return;
  }

  Db.updateWorkout(request.body.name, request.body.isGym).then((data) => {
    response.json(data[0]);
  });
});

var port = process.env.PORT || 8090;
app.listen(port);
console.log("Order API is running at " + port);

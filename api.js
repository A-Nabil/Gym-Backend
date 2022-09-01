var  Db = require('./dbContext');
var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
const apiMetrics = require('prometheus-api-metrics');
var  app = express();
var  router = express.Router();

app.use(apiMetrics())
app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

router.use((request, response, next) => {
    console.log('middleware');
    next();
  });
   
   
  router.route('/orders').get((request, response) => {
    user:  process.env.db_user;
    Db.getOrders().then((data) => {
      response.json(data[0]);
    })
  })

  router.route('/muscles').get((request, response) => {
    Db.getMuscles().then((data) => {
      response.json(data[0]);
    })
  })
  
  router.route('/orders/:id').get((request, response) => {
    Db.getOrder(request.params.id).then((data) => {
      response.json(data[0]);
    })
  })
    
    
  var  port = process.env.PORT || 8090;
  app.listen(port);
  console.log('Order API is running at ' + port);
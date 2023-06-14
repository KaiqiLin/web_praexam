var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// get all size from db
router.get('/getAllSizes',function(req,res,next){
  req.pool.query(
    "SELECT size FROM Shoes ORDER BY size ASC;",
    function (err, result) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        // console.log(result);
        res.send(JSON.stringify(result));
      }
    }
  );

});

// get highest price
router.get('/highest',function(req,res,next){
  req.pool.query(
    "SELECT price FROM Shoes ORDER BY price DESC limit 1;",
    function (err, result) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        // console.log(result);
        res.send(JSON.stringify(result));
      }
    }
  );

});

// select all shoes from db
router.post('/allShoes', function (req, res, next) {

  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.sendStatus(500);
    }
    let query = "select * from Shoes;";
    connection.query(query, function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        res.sendStatus(500);
        return;
      }
      //  console.log(JSON.stringify(rows));
      res.json(rows);
    });
  });

  });

  // select shoes you want
  router.post('/getyouwant', function (req, res, next) {
    if ('size' in req.body && 'style' in req.body && 'brand' in req.body && 'price' in req.body) {
      let query = `SELECT * FROM Shoes
        WHERE IFNULL(brand LIKE CONCAT('%', ?, '%'), true)
        AND IFNULL(style LIKE CONCAT('%', ?, '%'), true)
        AND price <= ?
        AND size = ?;`;
      let params = [
        req.body.brand,
        req.body.style,
        req.body.price,
        req.body.size
      ];
      req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
          res.sendStatus(500);
        }
        connection.query(query, params, function (qerr, rows, fields) {
          connection.release();
          if (qerr) {
            res.sendStatus(500);
            return;
          }
          res.json(rows);
        });
      });
    } else {
      res.sendStatus(400);
    }
  });



module.exports = router;

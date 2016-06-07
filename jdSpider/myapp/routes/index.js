var express = require('express');
var router = express.Router();

var redis = require('redis');
var redisClient = redis.createClient('6379', '127.0.0.1');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/jdSpider';

var initCommentsArray = function () {

    console.log("init success");
}();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/test', function (req, res, next) {
    res.send("test");
});

router.get('/productId', function (req, res) {
    redisClient.smembers('commentsId:queue', function (err, reply) {
        var rows = [],
            result = {
                total: 0,
                rows: []
            },
            i,
            index = 1;

        var response = reply.map(function (obj) {
            var robj = {};
            robj["id"] = index;
            robj["productId"] = obj;
            index++;
            return robj;
        });

        result.total = response.length;
        for (i = 0; i < 10; i++) {
            result.rows.push(response[i]);
        }


        console.log(response);
        res.json(result);
        //console.log(reply);
    })
});

router.get('/productInfo', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var commentsCallback = function (db, callback) {
        var commentsContent = [];
        var info = [];
        var indexNum = 1;
        var comments = db.collection('jdProductInfo_test2');
        comments.find({}).toArray(function (err, docs) {
            commentsContent = docs.map(function (obj) {
                var newObj;
                newObj = obj["product_info"];
                newObj["indexNum"] = indexNum;
                newObj["comments"] = "查看评论";
                indexNum++;
                return newObj;
            });
            res.send(commentsContent);
        });
        // comments.findOne({}, function(err, docs){
        //   res.send(docs);
        // })
    };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        commentsCallback(db, function () {
            db.close();
        });
    })

});


router.get('/productComments/*', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var productId = req.url.split("/")[2];
    if (productId.indexOf("?") !== -1) {
        productId = productId.split("?")[0];
        console.log(productId)
    }
    var commentsCallback = function (db, callback) {
        var commentsContent = [];
        var info = [];
        var indexNum = 1;
        var comments = db.collection('jdProductComments_test3');
        comments.find({'comments.product_id': productId}).toArray(function (err, docs) {
            commentsContent = docs.map(function (obj) {
                var newObj;
                newObj = obj["comments"];
                if (newObj["isMobile"] == true) {
                    newObj["isMobile"] = "手机用户"
                } else {
                    newObj["isMobile"] = "电脑用户"
                }
                newObj["indexNum"] = indexNum;
                indexNum++;
                return newObj;
            });
            res.send(commentsContent);
        });
        // comments.findOne({}, function(err, docs){
        //   res.send(docs);
        // })
    };

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        commentsCallback(db, function () {
            db.close();
        });
    })
});

router.get('/scrapymonitor/*', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    var setName = req.url.split("/")[2]
    if (setName.indexOf("?") !== -1) {
        setName = setName.split("?")[0];
        console.log(setName)
    }
     console.log(setName);
    var result = [];
    redisClient.smembers('commentsId'+ setName + '_cache:queue', function (err, reply) {
        for (let product_id in reply){
            redisClient.scard(reply[product_id] + setName, function (err, sum){
                let item = {};
                item["product_id"] = product_id;
                item["pageSum"] = sum;
                result.push(item);
                console.log(product_id);
                console.log("sum" + sum);
                console.log("length" + reply.length);
                if(result.length == reply.length ){
                    console.log(result);
                    //let resultJson = JSON.stringify(result);
                    res.send(result);
                }
            });

        }


    })


});

redisClient.on("error", function (err) {
    console.log("Error" + err);
});

redisClient.on("connect", function () {
    console.log("connected");
});

module.exports = router;

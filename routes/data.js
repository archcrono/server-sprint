var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('datadb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'datadb' database");
        db.collection('data', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'Data' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving data: ' + id);
    db.collection('data', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('data', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addData = function(req, res) {
    var datas = req.body;
    console.log('Adding datas: ' + JSON.stringify(datas));
    db.collection('data', function(err, collection) {
        collection.insert(datas, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateData = function(req, res) {
    var id = req.params.id;
    var datas = req.body;
    console.log('Updating datas: ' + id);
    console.log(JSON.stringify(datas));
    db.collection('data', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, datas, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating datas: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(datas);
            }
        });
    });
}

exports.deleteData = function(req, res) {
    var id = req.params.id;
    console.log('Deleting datas: ' + id);
    db.collection('data', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

var populateDB = function() {

    var data = [
    {
        name: "Batman",
        description: "Moody Super Hero",
    },
    {
        name: "Superman",
        description: "Sun Powered Super Hero",
    }];

    db.collection('data', function(err, collection) {
        collection.insert(data, {safe:true}, function(err, result) {});
    });

};
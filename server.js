var express = require('express'),
    data = require('./routes/data');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

app.get('/data', data.findAll);
app.get('/data/:id', data.findById);
app.post('/data', data.addData);
app.put('/data/:id', data.updateData);
app.delete('/data/:id', data.deleteData);



app.listen(3000);
console.log('The server is listening on port 3000');
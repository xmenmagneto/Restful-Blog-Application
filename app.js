var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer');

//app config
mongoose.connect('mongodb://restful_blog_app:13919273153dtc@ds159033.mlab.com:59033/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));



//mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);



//restful routes
app.get('/', function (req, res) {
    res.redirect('/blogs');
});


//index route
app.get('/blogs', function (req, res) {
    Blog.find({}, function (err, blogs) {
        if(err){
            console.log(err);
        }else{
            res.render('index', {blogs: blogs});
        }
    })
});


//new route  ==> show the form
app.get('/blogs/new', function (req, res) {
    res.render('new');
});


//create route
app.post('/blogs', function (req, res) {
    //create a new blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err){
           res.render('new');
        }else{
            //then, redirect to the index
            res.redirect('/blogs'); 
        }
    })
});



//show route
app.get('/blogs/:id',function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err){
            res.redirect('/blogs');
        }else {
            res.render('show', {blog: foundBlog});
        }
    })
});


//edit route
app.get('/blogs/:id/edit', function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
       if(err){
           res.redirect('/blogs');
       } else{
           res.render('edit', {blog: foundBlog});
       }
    });
});


//update route
app.put('/blogs/:id', function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs/' + req.params.id);
        }
    });
});


//delete route
app.delete('/blogs/:id', function (req, res) {
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs');
        }
    });
});



app.listen(process.env.PORT, function () {
   console.log('server is running on port '); 
});
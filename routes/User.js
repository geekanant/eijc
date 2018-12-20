const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const User = require("../database/models/User")
const Bug = require("../database/models/Bug")
const Advertise = require("../database/models/Advertise")
const ReportedUsers = require("../database/models/ReportedUsers")


const Post = require("../database/models/Post")
users.use(cors())
process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
    const today = new Date()
    const userData = {
        first_name:req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        date: today,
        phone:'',
        modeofcontact:'',
    }

    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
            
                    User.create(userData)
                        .then(user => {
                            
                            res.send(user);
                           
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                       
                    } else {
                res.json({ error: 'User already exists' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


users.post('/updatePhone', (req, res) => {

    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                
                    if(req.body.phone!=''){
                    user.update({phone:req.body.phone,modeofcontact:req.body.modeofcontact})
                    
                        .then(user => {
                            res.send(user);
                           
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                    }
                    else{
                            user.updateOne({modeofcontact:req.body.modeofcontact})
        
                                .then(user => {
                                    res.send(user);
                                   
                                })
                                .catch(err => {
                                    res.send('error: ' + err)
                                })
                          
                    }
                    } else {
                res.json({ error: 'User already exists' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

users.get('/postcontact', (req, res) => {
    User.findOne({
        email: req.query.postedByEmail
    })
        .then(user => {
           res.send(user);
        })
})

users.get('/categories', (req, res) => {
    const categories = [
        {
            id:"1",
            name:"App Development",
            title:"Need of an App Developer"
        },
        {
            id:"2",
            name:"Assignment Solving",
            title:"Need someone to solve my assignment"

        },
        {
            id:"3",
            name:"Books",
            title:"Need some books"

        },
        {
            id:"4",
            name:"Content Writing",
            title:"Need a good content writer"

        },
        {
            id:"5",
            name:"Data Entry",
            title:"Need a data entry person"

        },
        {
            id:"6",
            name:"Exam Help",
            title:"Need Help for exams"

        },
        {
            id:"7",
            name:"Notes",
            title:"Need Notes"

        },
        {
            id:"8",
            name:"Photoshop/Photo Editing",
            title:"Need someone for photoshop work"

        },
       
        {
            id:"9",
            name:"Photoshoot",
            title:"Need a photographer"

        },
        {
            id:"10",
            name:"Photocopy/Print Out",
            title:"Need Print out of my lab assignments"

        },
        {
            id:"11",
            name:"Practical File",
            title:"Need a Practical File"

        },
        {
            id:"12",
            name:"Promotions/Marketing",
            title:"Need someone to promote my startup"

        },
        {
            id:"13",
            name:"Project",
            title:"Need Help in my project"

        },
        {
            id:"14",
            name:"Video Editing",
            title:"Need someone for Video Editing"

        },
        {
            id:"15",
            name:"Web Development",
            title:"Need of a Website Developer"

        },
       {
            id:"16",
            name:"Other"
        }
    ];        
    res.send({
          category: categories
      })
})

users.get('/posts/:id', (req, res) => {

    Post.find({_id:req.params.id},  function (error, posts) {
        if (error) { console.error(error); }
        res.send({
              posts: posts
          })
      })
 })


 users.get('/getmodecontact', (req, res) => {

    User.findOne({
        email: req.query.email
    })
        .then(user => {
           res.send(user);
        })
 })


users.get('/posts/:id/delete', (req, res) => {

      Post.deleteOne({_id:req.params.id}, function (error, posts) {
        if (error) { console.error(error); }

        res.send({
            posts:posts
        
        });
    })
})

users.post('/posts/:id/edit', (req, res) => {
    Post.findOne({
        _id: req.params.id
    })
        .then(post => {
            if (post) {
                post.updateOne({  title: req.body.title,
                    startby: req.body.startby,
                    needitby: req.body.needitby,
                    price: req.body.price,
                    needat:req.body.needat,
                    content: req.body.content,
                    additionaldetails: req.body.additionaldetails,
                    category:req.body.category,
                    postedBy:req.body.userId,
                    postedByName:req.body.postedByName,
                    postedByEmail:req.body.postedByEmail})
                        .then(post => {
                            res.send(post);
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        });
                    }
                    })
});

users.get('/posts', (req, res) => {

    Post.find({created:{$gt:new Date(Date.now() - 24*60*60*7 * 1000)},postedBy:{$ne:req.query.postedBy}},  function (error, posts) {
        if (error) { console.error(error); }
        res.send({
              posts: posts
          })
      }).sort( { 'created': -1 } )
})


users.get('/archivedposts', (req, res) => {
    Post.find({created:{$lt:new Date(Date.now() - 24*60*60*7 * 1000)},postedBy:{$ne:req.query.postedBy}},  function (error, posts) {
        if (error) { console.error(error); }
        res.send({
              posts: posts
          })
      }).sort( { 'created': -1 } )
})

users.get('/myposts', (req, res) => {
    Post.find({postedBy:req.query.postedBy},  function (error, posts) {
        if (error) { console.error(error); }
        res.send({
              posts: posts
          })
      }).sort( { 'created': -1 } )
})



users.get('/findposts', (req, res) => {

    if(req.query.category==""){
        Post.find({created:{$gt:new Date(Date.now() - 24*60*60*7 * 1000)},postedBy:{$ne:req.query.postedBy}},  function (error, posts) {
            if (error) { console.error(error); }
            res.send({
                  posts: posts
              })
          }).sort( { 'created': -1 } )
    }
    else{
    Post.find({category:req.query.category,created:{$gt:new Date(Date.now() - 24*60*60*7 * 1000)},postedBy:{$ne:req.query.postedBy}},  function (error, posts) {
        if (error) { console.error(error); }
        res.send({
              posts: posts
          })
      }).sort( { 'created': -1 } )
    }
})

users.get('/myfindposts', (req, res) => {

    if(req.query.category==""){
        Post.find({postedBy:req.query.postedBy},  function (error, posts) {
            if (error) { console.error(error); }
            res.send({
                  posts: posts
              })
          }).sort( { 'created': -1 } )
    }
    else{
    Post.find({postedBy:req.query.postedBy,category:req.query.category},  function (error, posts) {
        if (error) { console.error(error); }
        res.send({
              posts: posts
          })
      }).sort( { 'created': -1 } )
    }
})

users.get('/archivedfindposts', (req, res) => {

    if(req.query.category==""){
        Post.find({created:{$lt:new Date(Date.now() - 24*60*60*7 * 1000)},postedBy:{$ne:req.query.postedBy}},  function (error, posts) {
            if (error) { console.error(error); }
            res.send({
                  posts: posts
              })
          }).sort( { 'created': -1 } )
    }
    else{
    Post.find({category:req.query.category,created:{$lt:new Date(Date.now() - 24*60*60*7 * 1000)}},  function (error, posts) {
        if (error) { console.error(error); }
        res.send({
              posts: posts
          })
      }).sort( { 'created': -1 } )
    }
})

users.post('/newPost', (req, res) => {
    const postData = {
        title: req.body.title,
        startby: req.body.startby,
        needitby: req.body.needitby,
        price: req.body.price,
        needat:req.body.needat,
        content: req.body.content,
        additionaldetails: req.body.additionaldetails,
        created: new Date(),
        category:req.body.category,
        postedBy:req.body.userId,
        postedByName:req.body.postedByName,
        postedByEmail:req.body.postedByEmail
   
    }

    Post.create(postData);

    res.send(true);
})


users.post('/newBug', (req, res) => {
    const bugData = {
       
        needat:req.body.needat,
        content: req.body.content,
        created: new Date(),
        postedBy:req.body.userId,
        postedByName:req.body.postedByName,
        postedByEmail:req.body.postedByEmail
    }
    Bug.create(bugData);
    res.send(true);
})


users.post('/advertise', (req, res) => {
    const adData = {
       
        title:req.body.title,
        email: req.body.email,
        created: new Date(),
        postedBy:req.body.userId,
        postedByName:req.body.postedByName,
        postedByEmail:req.body.postedByEmail
    }
    Advertise.create(adData);
    res.send(true);
})


users.post('/reportUser', (req, res) => {
    const adData = {
       
        
        email: req.body.email,
        created: new Date(),
        postedBy:req.body.userId,
        reportedPost:req.body.reportedPost,
        reportedByName:req.body.reportedByName,
        reportedByEmail:req.body.reportedByEmail
    }
    ReportedUsers.create(adData);
    res.send(true);
})

module.exports = users
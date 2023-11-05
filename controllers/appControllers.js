const {alumni, events} = require('../models/appModel');

exports.landing_page = function(req, res) {
    res.send('<h1>This will show the landing page</h1>');
}

exports.dashboard = function(req, res) {
    res.send('<h1>this will be the user dashboard</h1>');
    }

exports.manage_alumni = function(req, res){
    res.redirect('/manage_alumni.html');
}

exports.about = function(req, res){
    res.redirect('/about.html');
}

exports.login = function(req, res){
    res.redirect('/login.html');
}

exports.manage_events = function(req, res){
    res.redirect('/manage_events.html');
}
//CRUD operations - Events
/****************************************************************************/
exports.view_event = function(req, res){
    events.find({name: req.body.name}, function(err, events){
       console.log(req.body);
        if(err){
            console.log("Error occurred")
        } else {
            console.log("document retrieved: ", events);
            res.render('events',{
                events
            })
        }
    })
}

exports.add_event = function(req, res){
    const {name, category, date, time} = req.body
    console.log(name, category, date, time)
    events.insert({name, category, date, time}, function(err, newEvent){
        if(err){
            console.log("error", err);
        } else {
            console.log("inserted", newEvent);
            //res.json(newEvent)
            res.redirect('/manage_events');
            console.log('New event created');
        }
    })
}

exports.update_event = function(req, res){
    const query = {name: req.body.name}
    const update ={$set:{date: req.body.date}}
    
    events.update(query, update,{}, function(err, docs){
        console.log(req.body)
        if(err){
            console.log("error", err)
        }else{
            console.log("updated", docs)
            res.redirect('/manage_events')
        }
    })
}

exports.delete_event = function(req, res){
    console.log(req.body)
    events.remove({name: req.body.name},{}, function(err, numRemoved){
        if(err){
            console.log(err)
        }else{
            console.log(numRemoved, "documents deleted")
            res.redirect('/manage_events')
        }
    })
}

exports.all_events = function(req, res){
    events.find({}, function(err, events){
        if(err){
            console.log("Error occurred")
        } else {
            console.log("document retrieved: ", events);
            res.render('events',{
                events
            })
        }
    })
}
/****************************************************************************/

//CRUD operations - Alumni records
/****************************************************************************/
exports.view_alumnus = function(req, res){
    alumni.find({name: req.body.name}, function(err, alumni){
       console.log(req.body);
        if(err){
            console.log("Error occurred")
        } else {
            console.log("document retrieved: ", alumni);
            res.render('alumni',{
                alumni
            })
        }
    })
}

exports.add_alumnus = function(req, res){
    const {name, program, grad_year} = req.body
    console.log(name, program, grad_year)
    alumni.insert({name, program, grad_year}, function(err, newAlumnus){
        if(err){
            console.log("error", err);
        } else {
            console.log("inserted", newAlumnus);
            
            res.redirect('/manage_alumni');
            console.log('New alumnus created');
        }
    })
}

exports.update_alumnus = function(req, res){
    const query = {name: req.body.name}
    const update ={$set:{grad_year: req.body.grad_year}}
    
    alumni.update(query, update,{}, function(err, docs){
        console.log(req.body)
        if(err){
            console.log("error", err)
        }else{
            console.log("updated", docs)
            res.redirect('/manage_alumni')
        }
    })
}

exports.delete_alumnus = function(req, res){
    console.log(req.body)
    alumni.remove({name: req.body.name},{}, function(err, numRemoved){
        if(err){
            console.log(err)
        }else{
            console.log(numRemoved, "documents deleted")
            res.redirect('/manage_alumni')
        }
    })
}

exports.all_alumni = function(req, res){
    alumni.find({}, function(err, alumni){
        if(err){
            console.log("Error occurred")
        } else {
            console.log("document retrieved: ", alumni);
            res.render('alumni',{
                alumni
            })
        }
    })
}
/****************************************************************************/
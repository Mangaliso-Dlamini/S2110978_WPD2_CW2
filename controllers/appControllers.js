const {alumni, events} = require('../models/appModel');
const userDao = require('../models/userMD.js');
//const auth = require('../auth/auth.js');
const {ensureLoggedIn} = require('connect-ensure-login');
//const db = new guestbookDAO();


const { usersDB } = require('../models/userModel.js');
const auth = require('../auth/auth.js');
const { session } = require('passport');

const util = require('util');
const { error } = require('console');
const eventsFindAsync = util.promisify(events.find.bind(events));


exports.landing_page = function(req, res) {
    if(!req.session.user){
        res.render('index');
    }else{
        res.redirect('/loggedIn_landing')
    } 
    
}
exports.loggedIn_landing = function(req, res){
    const user = req.session.user;

    const templateData = {
        user,
        isAdmin: user.role === 'admin',
        isAuthenticated: !user === false,
      };
    

    res.render('index', templateData)
}

exports.dashboard = function (req, res) {
    const user = req.session.user;

    const templateData = {
        user,
        isAdmin: user.role === 'admin',
        isAuthenticated: user.role === 'user',
      };
    


    events.find({ organiser_id: req.session.user.username }, function (err, my_events) {
        if (err) {
            console.log("Error occurred");
            return res.status(500).send('Internal Server Error');
        }

        console.log("Organizer events retrieved: ", my_events);

        // Find events where the user is a participant
        events.find({ participants: req.session.user.username }, (err, p_events) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            if (p_events) {
                console.log('Participant events found:', p_events);
                const query = {
                    $or: [
                      {
                        organiser_id: { $ne: req.session.user.username },
                        participants: { $not: { $in: [req.session.user.username] } }
                      },
                      {
                        $or: [
                          { organiser_id: { $exists: false } },
                          { participants: { $exists: false } }
                        ]
                      }
                    ]
                  };
                  
                  
                                    
                // Find all events in the database
                events.find({
                    $and: [
                        { $or: [{ organiser_id: { $ne: req.session.user.username } }, { organiser_id: { $exists: false } }] },
                        { $or: [{ participants: {  $nin: [req.session.user.username] } }, { participants: { $exists: false } }] }
                      ]  
                }, (err, all_events) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }

                    if (all_events) {
                        console.log('All events found:', all_events);

                        // Combine all sets of events into a single object
                        const allEvents = {
                            my_events,
                            p_events,
                            all_events
                        };
                        console.log(templateData);
                        // Render the dashboard with all events
                        res.render('dashboard', {
                            my_events,
                            p_events,
                            all_events,
                            templateData
                        });
                    } else {
                        console.log('No events found.');
                        // Render the dashboard with only organizer and participant events
                        res.render('dashboard', {
                            my_events,
                            p_events,
                            templateData
                        });
                    }
                });
            } else {
                console.log('Participant events not found.');
                // Render the dashboard with only organizer events
                res.render('dashboard', {
                    my_events,
                    templateData
                });
            }
        });
    });
};

/*exports.dashboard = async function (req, res) {
    const user = 'Meestar Manga';
    const loggedUser = req.session.user;
  
    const templateData = {
      loggedUser,
      isAdmin: loggedUser.role === 'admin',
      isAuthenticated: loggedUser.role === 'user',
    };
  
    try {
      const my_events = await eventsFindAsync({ organiser: user });
      console.log("Organizer events retrieved: ", my_events);
  
      const p_events = await eventsFindAsync({ participants: user });
      console.log('Participant events found:', p_events);
  
      const all_events = await eventsFindAsync({});
      console.log('All events found:', all_events);
  
      const allEvents = {
        my_events,
        p_events,
        all_events
      };
  
      console.log(templateData);
      
      // Render the dashboard with all events
      res.render('dashboard', {
        my_events,
        p_events,
        all_events,
        templateData
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };*/

  exports.admin_dashboard = function(req, res){
    alumni.find({}, function(err, alumni){
        if(err){
            console.log("Error occurred")
        } else {
            console.log("alumni retrieved: ", alumni);
            
            usersDB.find({}, function(err, users){
                if(err){
                    console.log("Error occurred")
                } else {
                    console.log("users retrieved: ", users);

                    events.find({}, function(err, events){
                        if(err){
                            console.log("Error occurred")
                        } else {
                            console.log("events retrieved: ", events);
                            
                            // Render the admin_dash view with retrieved data
                            res.render('admin_dash', { users, alumni, events });
                        }
                    });
                }
            });
        }
    });
};

exports.manage_alumni = function(req, res){
    res.redirect('/manage_alumni.html');
}

exports.about = function(req, res){
    events.find({}, function(err, events){
        if(err){
            console.log("Error occurred")
        } else {
            console.log("document retrieved: ", events);

            //const nameMatchingEvents = matchingEvents.filter(event => event.name === name);
            //const dateMatchingEvents = matchingEvents.filter(event => event.date === date);

            const pro_events = events.filter(event=>event.category === 'Professional Development');
            const net_events = events.filter(event=>event.category === 'Networking Event');
            const cam_events = events.filter(event=>event.category === 'Campus Event');

            res.render('about',{
                pro_events,
                net_events,
                cam_events
            })
        }
    })
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
    const {name, organiser, category, date, time} = req.body
    const user = req.session.user;
    console.log(name, category, date, time)
    events.insert({name, organiser,organiser_id: user.username, category, date, time}, function(err, newEvent){
        if(err){
            console.log("error", err);
        } else {
            console.log("inserted", newEvent);
            //res.json(newEvent)
            res.redirect('/dashboard');
            console.log('New event created');
        }
    })
}

exports.update_event = function(req, res){
    //const {id, name, organiser, category, date, time} = req.body
    const name= req.body.name;
    const organiser= req.body.organiser;
    const category= req.body.category;
    const date = req.body.date;
    const time = req.body.time;
    const id = req.body.id;
    const query = {_id:id}
    console.log(id)
    const update ={$set:{name:name, organiser:organiser, category: category, date: date, time: time}}
    
    events.update(query, update,{}, function(err, docs){
        console.log(req.body)
        if(err){
            console.log("error", err)
        }else{
            console.log("updated", docs)
            res.redirect('/dashboard')
        }
    })
}

exports.delete_event = function(req, res){
    console.log(req.body)
    events.remove({_id: req.body.ident},{}, function(err, numRemoved){
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

            //const nameMatchingEvents = matchingEvents.filter(event => event.name === name);
            //const dateMatchingEvents = matchingEvents.filter(event => event.date === date);

            const pro_events = events.filter(event=>event.category === 'Professional Development');
            const net_events = events.filter(event=>event.category === 'Networking Event');
            const cam_events = events.filter(event=>event.category === 'Campus Event');

            res.render('events',{
                pro_events,
                net_events,
                cam_events
            })
        }
    })
}
exports.add_participant = function(req, res){
    const id = req.body.ident;
    console.log(id)
    events.findOne({_id: id}, function(err, event){
        if (err) {
            console.error(err);
            return;
        }
        if(event){
            if(!event.participant){
                event.participant = [];
            }

            event.participant.push(req.session.user.username);

            events.update({_id: id}, {$set: {participants: event.participant }},{},function(updateErr, numUpdated){
                if (updateErr) {
                    console.error(updateErr);
                } else {
                    console.log(`Updated ${numUpdated} document(s) with the new name.`);
                    res.redirect('/manage_events');
                }
            })
    } else {
        console.log('Document not found.');
    }
});
}

exports.unparticipate = function(req, res){
    user = req.session.user
    console.log(req.body.ident);
    console.log(user)
    events.update(
        { _id: req.body.ident },
        { $pull: { participants: user.username } },
        {},
        (err, numRemoved) => {
          if (err) {
            console.error('Error removing name:', err);
            return;
          }
    
          console.log(`Removed ${numRemoved} occurrence(s) of '${user.username}' from event ${req.body.ident}`);
          res.redirect('/dashboard')

          //res.json({ success: true, message: 'Text received successfully.' });
        }
      );
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
    const {id, name, program, grad_year} = req.body
    console.log(name, program, grad_year)
    alumni.insert({_id: id, name, program, grad_year}, function(err, newAlumnus){
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
    const {id, name, program, grad_year} = req.body
    const query = {_id: id}
    const update ={$set:{name: name, program: program, grad_year: grad_year}}
    
    alumni.update(query, update,{}, function(err, docs){
        console.log(req.body)
        if(err){
            console.log("error", err)
        }else{
            console.log("updated", docs)
            res.redirect('/admin_dashboard')
        }
    })
    
}

exports.delete_alumnus = function(req, res){
    console.log(req.body);
    alumni.remove({_id: req.body.ident},{}, function(err, numRemoved){
        if(err){
            console.log(err)
        }else{
            console.log(numRemoved, "documents deleted")
            res.redirect('/admin_dashboard')
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

exports.login = function(req, res){
    res.redirect('/login.html');
}

exports.register = function(req, res){
    res.redirect('/login.html');
}

exports.new_user = function(req, res){
    console.log(req.body)
   const username = req.body.username
    const hashedPassword = auth.hashPassword(req.body.password)

    usersDB.findOne({ username }, (err, user) => {
        if(err){
            console.log('error', err);
        }else{
            if(user){
                console.log('user already exist', user);
                
            }else{
                console.log(user)
                alumni.findOne({_id: username}, function(e, alumnus){
                    if(e){
                        console.log('error', e);
                        return;
                    }

                    if(!alumnus){
                        console.log('no match');
                        res.redirect('register')
                    }else{
                        console.log('id math', alumnus)
                        const role = 'user'
                        usersDB.insert({ username, password: hashedPassword, role }, function(err, newUser){
                            if(err){
                                console.log("error", err);
                            } else {
                                console.log("inserted", newUser);
                        
                                res.redirect('/login');
                                console.log('New user created');
                            }  
                
                        })
                    }
                })
            
            }

        }
    });
}

exports.post_login = function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body)
    usersDB.findOne({ username }, (err, user) => {
        if (user && auth.comparePasswords(password, user.password)) {
          //callback(null, user);
          req.session.user = user;
          console.log(user);
          res.redirect('/dashboard');
        } else {
            console.log("error", err);
          //callback(err || 'Invalid credentials');
          res.redirect('/login');
        }
      });
}

exports.logout = (req, res) => {
    req.session.destroy();
    console.log("logged out");
    res.redirect('/login');
  }
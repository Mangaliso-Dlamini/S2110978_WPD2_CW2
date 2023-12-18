const express = require('express');

const router = express.Router();

const controller = require('../controllers/appControllers.js');

const auth = require('../auth/auth.js');
const {ensureLoggedIn} = require('connect-ensure-login');

router.get("/", controller.landing_page);
router.get('/dashboard', auth.isAuthenticated, controller.dashboard);
router.get('/admin_dashboard', auth.isAdmin, controller.admin_dashboard);

//CRUD routes - Events
router.post("/view_event", controller.view_event)
router.post("/add_event", controller.add_event)
router.post("/update_event", controller.update_event);
router.post("/delete_event", controller.delete_event);
router.get('/all_events', auth.isAuthenticated, controller.all_events);

//CRUD routes - Alumni records
router.post("/view_alumnus", controller.view_alumnus)
router.post("/add_alumnus", controller.add_alumnus)
router.post("/update_alumnus", controller.update_alumnus);
router.post("/delete_alumnus", controller.delete_alumnus);
router.post('/all_alumni', controller.all_alumni);

router.get('/about', controller.about)
//router.get('/login', controller.login)
router.get('/manage_events', auth.isAuthenticated, controller.manage_events)
router.get('/manage_alumni', auth.isAuthenticated, controller.manage_alumni)

//authentication
router.get('/register', controller.register);
router.get('/login', controller.login);
router.post('/register', controller.new_user);
router.post("/login", controller.post_login);

router.get('/logout', controller.logout);

router.get('/loggedIn_landing', auth.isAuthenticated, controller.loggedIn_landing);

router.post('/delete_user', controller.delete_user)
router.post('/update_user', controller.update_user)

// Routes
/*router.get('/', auth.isAuthenticated, (req, res) => {
    res.send('Home Page - Welcome!');
  });*/
  

//add particpants
router.post('/add_participant', controller.add_participant)
router.post('/unparticipate', controller.unparticipate)

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})

router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})

module.exports = router;
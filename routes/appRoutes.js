const express = require('express');

const router = express.Router();

const controller = require('../controllers/appControllers.js');

router.get("/", controller.landing_page);
router.get('/dashboard', controller.dashboard);

//CRUD routes - Events
router.post("/view_event", controller.view_event)
router.post("/add_event", controller.add_event)
router.post("/update_event", controller.update_event);
router.post("/delete_event", controller.delete_event);
router.post('/all_events', controller.all_events);

//CRUD routes - Alumni records
router.post("/view_alumnus", controller.view_alumnus)
router.post("/add_alumnus", controller.add_alumnus)
router.post("/update_alumnus", controller.update_alumnus);
router.post("/delete_alumnus", controller.delete_alumnus);
router.post('/all_alumni', controller.all_alumni);

router.get('/about', controller.about)
router.get('/login', controller.login)
router.get('/manage_events', controller.manage_events)
router.get('/manage_alumni', controller.manage_alumni)

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
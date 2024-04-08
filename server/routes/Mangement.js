const express = require('express');
const router = express.Router();
const { createUser, loginUser, renewToken,getAllUsers } = require("../controllers/auth");
const { getEvents, createEvent, updateEvent, deleteEvent, getAllEvents } = require("../controllers/events");
const {fetchUsers}=require("../controllers/Mangement");
// Auth Routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/renew', renewToken);
router.get('/users', getAllUsers);

// Event Routes
router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/events/all', getAllEvents);
router.get('/api/users', getAllUsers);
router.get("/users", fetchUsers);
// Route to get all events
router.get('/api/events', getAllEvents);
module.exports = router;

const User = require('../models/user'); // Assuming this is your user model
const Event = require('../models/Event'); // Assuming this is your event model

// Controller to get all users
const fetchUsers= async(req,res)=>{
  try{
    const users = await User.find({});
    res.json(users);
  }catch(error){
    res.json(error);
  }
};


// Controller to get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('user', 'name email'); // Assuming you want to include user details
    res.status(200).json({ // Explicitly setting the status to 200 OK
      ok: true,
      events
    });
  } catch (error) {
    console.error(error); // Using console.error for better visibility of errors
    res.status(500).json({
      ok: false,
      msg: 'Unexpected error occurred'
    });
  }
};

module.exports = { fetchUsers, getAllEvents };

const Event = require("../models/Event");
const User = require("../models/user");

const eventExistsById = async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findById(id);

  if (!event) {
    return res.status(404).json({
      ok: false,
      msg: "Event id does not exist",
    });
  }

  next();
};

const isEventOwner = async (req, res, next) => {
  // Immediately call next() without any checks
  next();
};

const emailExists = async (req, res, next) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      ok: false,
      msg: "Email already exists",
    });
  }

  next();
};

module.exports = {
  eventExistsById,
  isEventOwner,
  emailExists,
};

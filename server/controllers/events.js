const Event = require("../models/Event");
const User = require("../models/user");


const getEvents = async (req, res) => {
  try {
    // Use req.id to match with your validateJWT.js setup
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ ok: false, msg: "User not found." });
    }
    if (!user.family) {
      return res.status(400).json({ ok: false, msg: "User does not belong to a family." });
    }
    const events = await Event.find({ family: user.family }).populate("user");

    return res.json({
      ok: true,
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the administrator",
    });
  }
};



const createEvent = async (req, res) => {
  const { title, start, end, notes } = req.body;

  try {
    // Again, using req.id here
    const user = await User.findById(req.id);
    if (!user.family) {
      return res.status(400).json({ ok: false, msg: "User does not belong to a family." });
    }
    const event = new Event({
      title,
      start,
      end,
      notes,
      user: req.id, // This is aligned with validateJWT.js
      family: user.family, // Assign the user's family ID to the event
    });

    await event.save();

    return res.status(201).json({
      ok: true,
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the administrator",
    });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, start, end, notes } = req.body;

  try {
    // Verifying both event ID and that the user's family owns the event
    const user = await User.findById(req.id);
    const event = await Event.findOne({ _id: id, family: user.family });

    if (!event) {
      return res.status(404).json({ ok: false, msg: "Event not found or access denied" });
    }

    // Directly update without finding again since we already have the validation above
    event.title = title;
    event.start = start;
    event.end = end;
    event.notes = notes;
    await event.save();

    return res.json({ ok: true, event });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the administrator",
    });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    // Use req.id and ensure the event belongs to the user's family
    const user = await User.findById(req.id);
    const event = await Event.findOneAndDelete({ _id: id, family: user.family });

    if (!event) {
      return res.status(404).json({ ok: false, msg: "Event not found or access denied" });
    }

    return res.json({ ok: true, msg: "Event deleted", event });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the administrator",
    });
  }
};
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events || events.length === 0) {
      return res.status(404).json({ ok: false, msg: "No events found." });
    }
    return res.status(200).json({ ok: true, events });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: "Please, contact the administrator." });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent, getAllEvents };
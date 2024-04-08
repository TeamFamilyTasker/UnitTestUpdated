const express = require("express");
const router = express.Router();
const Family = require("../models/family"); // Assuming FamilyModel is the filename where you export your Mongoose model

// Create a new family
router.post("/families", async (req, res) => {
  try {
    const family = await Family.create(req.body);
    res.status(201).json(family);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all families
router.get("/families", async (req, res) => {
  try {
    const families = await Family.find();
    res.status(200).json(families);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single family by ID
router.get("/families/:id", async (req, res) => {
  try {
    const family = await Family.findById(req.params.id)
      .populate('members.userId', 'name') // Assuming 'name' is a field you want from the User model
      .lean(); // Convert to plain JavaScript object to make manipulation easier

    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    // Transform members to match desired output
    const transformedMembers = family.members.map(member => ({
      userId: member.userId._id, // Assuming you want the ObjectId as the userId
      roleInFamily: member.roleInFamily
    }));

    // Construct the response object
    const responseObject = {
      familyId: family.familyId,
      familyName: family.familyName,
      members: transformedMembers
    };

    res.status(200).json(responseObject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a family by ID
router.delete("/families/:id", async (req, res) => {
  try {
    const family = await Family.findByIdAndDelete(req.params.id);
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }
    res.status(200).json({ message: "Family deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

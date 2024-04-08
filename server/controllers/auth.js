const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const generateJWT = require("../helpers/jwt");
const Family = require("../models/family");
const { v4: uuidv4 } = require('uuid');

const createUser = async (req, res) => {
  const { email, password, name, familyId, familyName, roleInFamily } = req.body;
  const generatedFamilyId = uuidv4();

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ ok: false, msg: "User email already exists." });
    }
    
    let family;
    if (familyId) {
      // Attempt to add the user to an existing family
      family = await Family.findOne({ familyId });
      if (!family) {
        return res.status(404).json({ ok: false, msg: "Family not found" });
      }
    } else {
      // Generate a UUID for the familyId if not provided      
      // Create a new family with the generated familyId and familyName
      family = new Family({
        familyId: generatedFamilyId,
        familyName: familyName,
      });
    }
  
    // Creating the user after dealing with family
    const salt = bcryptjs.genSaltSync();
    user = new User({
      name,
      email,
      password: bcryptjs.hashSync(password, salt),
      family: family._id, // Assign familyId here
    });
    await user.save();
  
    // Add the user to the family members
    family.members.push({ userId: user._id, name, roleInFamily });
    await family.save();
  
    const token = await generateJWT(user._id, user.name);
    // Send familyId in the response along with other data
    return res.status(201).json({ ok: true, user, familyId:generatedFamilyId, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: "Please, contact the administrator." });
  }
};



const loginUser = async (req, res) => {
  const { email, password,role } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "User email does not exist",
      });
    }

    // Verify if passwords match
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        msg: "Invalid password.",
      });
    }

    const token = await generateJWT(user.id, user.name,user.role);

    return res.status(200).json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Please, contact the administrator",
    });
  }
};

const renewToken = async (req, res) => {
  const { id, name } = req;

  const token = await generateJWT(id, name);

  res.json({ ok: true, user: { _id: id, name }, token });
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res.status(404).json({ ok: false, msg: "No users found." });
    }
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: "Please, contact the administrator." });
  }
};

module.exports = { createUser, loginUser, renewToken, getAllUsers };
const { Schema, model } = require("mongoose");

const FamilySchema = new Schema({
  familyName: {
    type: String,
    required: [true, "Family name is required"], // Make it required with a message
  },
  familyId: {
    type: String, // Adjusted type to String for UUID
    required: true,
    unique: true
  },
  members: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    roleInFamily: {
      type: String,
      enum: ['parent', 'child', 'grandparent'],
      required: true
    }
  }]
});

const Family = model('Family', FamilySchema);

module.exports = Family;

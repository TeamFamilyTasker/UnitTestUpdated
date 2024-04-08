const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  family: {
    type: Schema.Types.ObjectId,
    ref: 'Family', // Referencing the Family model
  },
  role: {
    type: String,
    required: true,
    default: 'user', // default role is 'user'
    enum: ['user', 'admin'] // allowed roles
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, family, ...user } = this.toObject();
  return user;
};

module.exports = model("User", UserSchema);

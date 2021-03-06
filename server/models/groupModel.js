var Q = require('q');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10; // required for salt gen
var Schema = mongoose.Schema;


exports.schema = groupSchema = new Schema({
  groupname: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String,
  name: String,
  email: String,
  photo: String,
  startTime: {
    type: Number,
    default: 12
  },
  endTime: {
    type: Number,
    default: 12
  }
});

groupSchema.methods.comparePasswords = function(passwordAttempt) {
  var savedPassword = this.password;
  // should return a promise that compares passwords
  return Q.promise(function(resolve, reject) {
    bcrypt.compare(passwordAttempt, savedPassword, function(err, isMatch) {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

groupSchema.pre('save', function(next) {
  var group = this;
  if (!group.isModified('password')) {
    return next(); // perform next middlewar action on the controller
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    } else {
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        } else {
          user.password = hash;
          user.salt = salt;
          next();
        }
      });
    }
  });
});

// export the group model
exports.model = mongoose.model('Group', groupSchema);

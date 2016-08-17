/**
 * Users.js
 *
 * @module 			models/users
 * @description		Describes a single user in the database.
 * @author			Manikandan S <raghav.manikandan@gmail.com>
 */

 module.exports = {

   attributes: {
     name        : { type: 'string' },
     emailAddress: { type: 'email' },
     password    : { type: 'string' }
   },

   beforeCreate: function(values, next) {
     if (values.password) {
       var bcrypt = require('bcrypt');

       bcrypt.genSalt(10, function(err, salt) {
         if (err) return next(err);

         bcrypt.hash(values.password, salt, function(err, hash) {
           values.password = hash;
           next();
         });
       });
     } else {
       next();
     }
   },

   // Hash the password
   beforeUpdate: function(values, next) {
 		if (values.password) {
 			var bcrypt = require('bcrypt');

 			bcrypt.genSalt(10, function(err, salt) {
		    if (err) return next(err);

		    bcrypt.hash(values.password, salt, function(err, hash) {
          values.password = hash;
          next();
		    });
 			});
 		} else {
 			next();
 		}
 	}

 };

/**
 * UsersController
 *
 * @module			controllers/user
 * @description		Responsible for all user-related actions.
 * @author			Manikandan S <raghav.manikandan@gmail.com>
 */

 module.exports = {

  /**
	 * @description		Register a new user.
   */
   register: function(req, res) {
     Users.find({ emailAddress: req.param('emailAddress') }).exec(function(err, existingUser) {
       if (err) res.status(500).json({ error: 'Database Error' });

       if (existingUser.length > 0) {
         return res.status(403).json({ error: 'User alredy exists.' });
       } else {
         var newUser = {
           name         : req.param('name'),
           emailAddress : req.param('emailAddress'),
           password     : req.param('password')
         }

         Users.create(newUser).exec(function(err, user) {
		       if (err) return res.status(500).json({ error: 'Database error' });

           var jwt = require('jsonwebtoken');

           var jwtPayload = {
             userId: user.id
           }

           var token = jwt.sign(jwtPayload, 'u%v-c_p~F}*7j5eC');

           // Add the token to response
           user['token'] = token;

           // Delete unnecessary fields
           delete user.password;

           res.status(200).json(user);
         });
       }
     });
   },


  /**
   * @description		Accepts a user's details to verify if the account exists. Returns the
   *					user object from the database along with a JWT if it exists.
   */
   authenticate: function(req, res) {
     var jwt = require('jsonwebtoken');

     Users.find({ emailAddress: req.param('emailAddress') }).exec(function(err, user) {
       if (err) res.status(500).json({ error: 'Database Error' });

       if (user.length > 0) {
         var bcrypt = require('bcrypt');

         bcrypt.compare(req.param('password'), user[0].password, function(err, match) {
					if (err) return res.status(500).json({ error: 'Some Error' });

					if (match) {
						// Don't send back the password in the response
						delete user[0].password;

            // Returning user
            var jwtPayload = {
              userId	: user[0].id
            };

            var token = jwt.sign(jwtPayload, 'u%v-c_p~F}*7j5eC');

            user[0]['token'] = token;

            // Delete unnecessary fields
            delete user[0].password;

            res.status(200).json(user);
          } else {
            return res.status(403).json({ error: 'Please check your Credentials.' });
          }
        });
       } else {
         return res.status(403).json({ error: 'User could not be found.' });
       }
     });
   },


   /**
    * @description		Existing user's information.
    */
    profile: function(req, res) {
      Users.find({ id: req.param('id') }).exec(function(err, user) {
        if (err) res.status(500).json({ error: 'Database Error' });

        if (user.length > 0) {
          // Delete unnecessary fields
          delete user[0].password;

          res.status(200).json(user);
        } else {
          return res.status(403).json({ error: 'User could not be found.' });
        }
      });
    },


    /**
     * @description		Update user's information.
     */
     updateUser: function(req, res) {
       Users.find({ id: req.param('id') }).exec(function(err, user) {
         if (err) res.status(500).json({ error: 'Database Error' });

         if (user.length > 0) {
           var jsonfy 	= require('jsonfy'),
					   values 	= jsonfy(req.param('values'));

           // Edit the user record
 				   Users.update({ id: req.param('id') }, values).exec(function(err, editedUser) {
   					 if (err) res.status(500).json({ error: 'Database Error' });

             // Delete unnecessary fields
             delete editedUser[0].password;

             return res.status(200).json(editedUser);
           });
         } else {
           return res.status(403).json({ error: 'User could not be found.' });
         }
       });
     }

 };

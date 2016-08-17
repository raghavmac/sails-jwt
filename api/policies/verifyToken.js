/**
 * verifyToken
 *
 * @module			policies/verifytoken
 * @description		Allows access to a route only if the JWT is valid.
 * @author			Manikandan S <raghav.manikandan@gmail.com>
 */

 module.exports = function(req, res, next) {

   var token = req.param('token') || req.headers['x-access-token'];

   if (token) {
     var jwt = require('jsonwebtoken');

     jwt.verify(token, 'u%v-c_p~F}*7j5eC', function(err, decoded) {
       if (err) return res.status(401).json({ error: 'You provided an invalid token.' });

       // Save the token to be used in the controller
       req.decoded = decoded;

       // Check if the user exists
       if (decoded.userId) {
         Users.find({ id: decoded.userId }).exec(function(err, user) {
           if (err) return res.status(500).json({ error: 'Database error' });

           if (user.length > 0) {
             req.decoded['user'] = user[0];

             return next();
           } else {
             return res.status(403).json({ error: 'Could not find the user.' });
           }
         });
       }
     });
   } else {
     return res.status(403).json({ error: 'You did not provide a token.' });
   }
   
 };

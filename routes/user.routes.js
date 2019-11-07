const middleware = require('../utils');

module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Login a user and return a jwt
    app.post('/login', users.login);

    // Create a new User
    app.post('/users', users.create);

    // Retrieve all Users
    app.get('/users', middleware.checkToken, users.findAll);

    // Retrieve a single User with userId
    app.get('/users/:userId', middleware.checkToken, users.findOne);

    // Update a User with userId
    app.put('/users/:userId', middleware.checkToken, users.update);

    // Delete a User with userId
    app.delete('/users/:userId', middleware.checkToken, users.delete);
}

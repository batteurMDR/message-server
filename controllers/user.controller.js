const User = require('../models/user.model.js');
const config = require('../token.config');
let jwt = require('jsonwebtoken');

// Login a user
exports.login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({username})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Username not found"
            });            
        }
        if (username && password) {
            if (username === mockedUsername && password === mockedPassword) {
                let token = jwt.sign({_id: user._id,username: username},
                    config.secret,
                    { 
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                // return the JWT token for the future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            } else {
                res.send(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

// Create and Save a new User
exports.create = (req, res) => {

    // Validate request
    if(!req.body.username || !req.body.password) {
        return res.status(400).send({
            message: "User username or password can not be empty"
        });
    }

    // Create a User
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    // Save User in the database
    user.save()
    .then(data => {
        let token = jwt.sign({_id: data._id,username: req.body.username},
            config.secret,
            { 
                expiresIn: '24h' // expires in 24 hours
            }
        );
        res.json({
            success: true,
            message: 'Authentication successful!',
            token: token
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Find a single User with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

// Update a User identified by the userId in the request
exports.update = (req, res) => {
    // Find user and update it with the request body
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });            
        }
        User.findByIdAndUpdate(req.params.userId, {
            username: req.body.username ? req.body.username : user.username,
            password: req.body.password ? req.body.password : user.password
        }, {new: true})
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });                
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.userId
            });
        });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

// Delete a User with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};
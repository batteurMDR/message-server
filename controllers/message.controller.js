const utils = require('../utils');
const Message = require('../models/message.model.js');

// Create and Save a new Message in channel
exports.create = (req, res) => {

    // Validate request
    if(!req.body.message || !req.params.channel) {
        return res.status(400).send({
            message: "Message or channel can not be empty"
        });
    }

    // Create a Message
    const message = new Message({
        message: req.body.message,
        channel: req.params.channel,
        author: utils.getUserFromToken(req)._id
    });

    // Save Message in the database
    message.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Message."
        });
    });
};

// Retrieve and return all Messages from channel.
exports.findAll = (req, res) => {
    Message.find({channel: req.params.channel}).populate({ path: 'author', select: '-password' })
    .then(messages => {
        res.send(messages);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving messages."
        });
    });
};

// Update a Message identified by the messageId in the request
exports.update = (req, res) => {
    // Find message and update it with the request body
    Message.findById(req.params.messageId)
    .then(message => {
        if(!message) {
            return res.status(404).send({
                message: "Message not found with id " + req.params.messageId
            });            
        }
        Message.findByIdAndUpdate(req.params.messageId, {
            message: req.body.message ? req.body.message : message.message
        }, {new: true})
        .then(message => {
            if(!message) {
                return res.status(404).send({
                    message: "Message not found with id " + req.params.messageId
                });
            }
            res.send(message);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Message not found with id " + req.params.messageId
                });                
            }
            return res.status(500).send({
                message: "Error updating message with id " + req.params.messageId
            });
        });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Message not found with id " + req.params.messageId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving message with id " + req.params.messageId
        });
    });
};

// Delete a Message with the specified messageId in the request
exports.delete = (req, res) => {
    Message.findByIdAndRemove(req.params.messageId)
    .then(message => {
        if(!message) {
            return res.status(404).send({
                message: "Message not found with id " + req.params.messageId
            });
        }
        res.send({message: "Message deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Message not found with id " + req.params.messageId
            });                
        }
        return res.status(500).send({
            message: "Could not delete message with id " + req.params.messageId
        });
    });
};
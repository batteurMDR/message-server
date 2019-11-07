const middleware = require('../utils');

module.exports = (app) => {
    const messages = require('../controllers/message.controller.js');

    // Create a new Message in channel
    app.post('/messages/:channel', middleware.checkToken, messages.create);

    // Retrieve all Messages from channel
    app.get('/messages/:channel', middleware.checkToken, messages.findAll);

    // Update a Message with messageId
    app.put('/messages/:messageId', middleware.checkToken, messages.update);

    // Delete a Message with messageId
    app.delete('/messages/:messageId', middleware.checkToken, messages.delete);
}

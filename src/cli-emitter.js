const EventEmitter = require("events");

class CliEmitter extends EventEmitter {};

module.exports = new CliEmitter();
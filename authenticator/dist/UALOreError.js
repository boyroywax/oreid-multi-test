"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UALOreError = void 0;
const universal_authenticator_library_1 = require("universal-authenticator-library");
class UALOreError extends universal_authenticator_library_1.UALError {
    constructor(message, type, cause) {
        super(message, type, cause, "Wax");
    }
}
exports.UALOreError = UALOreError;

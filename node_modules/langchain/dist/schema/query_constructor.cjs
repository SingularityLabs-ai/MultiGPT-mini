"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeInfo = void 0;
class AttributeInfo {
    constructor(name, type, description) {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: name
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: type
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: description
        });
    }
}
exports.AttributeInfo = AttributeInfo;

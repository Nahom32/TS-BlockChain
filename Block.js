"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
class Block {
    constructor(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
    }
}
exports.Block = Block;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBlockToChain = exports.getLatestBlock = exports.isValidBlockStructure = exports.getBlockChain = exports.isValidChain = exports.replaceChain = exports.generateNextBlock = exports.calculateHashForBlock = void 0;
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const Block_1 = require("./Block");
const p2p_1 = require("./p2p");
const calculate_hash = (index, previousHash, timestamp, data) => {
    if (typeof (previousHash) == 'string')
        return (0, sha256_1.default)(index + previousHash + timestamp + data).toString();
    else
        return (0, sha256_1.default)(index + '' + timestamp + data).toString();
};
const genesisBlock = new Block_1.Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'my genesis block!!');
let blockchain = [genesisBlock];
const getLatestBlock = () => {
    return blockchain[blockchain.length - 1];
};
exports.getLatestBlock = getLatestBlock;
const generateNextBlock = (blockData) => {
    const previousBlock = getLatestBlock();
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = new Date().getTime() / 1000;
    const nextHash = calculate_hash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    const newBlock = new Block_1.Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, blockData);
    (0, p2p_1.broadcastLatest)();
    return newBlock;
};
exports.generateNextBlock = generateNextBlock;
const calculateHashForBlock = (block) => {
    return calculate_hash(block.index, block.previousHash, block.timestamp, block.data);
};
exports.calculateHashForBlock = calculateHashForBlock;
const isGenesisBlock = (block) => {
    return JSON.stringify(block) == JSON.stringify(genesisBlock);
};
const isValidBlock = (previous_block, new_block) => {
    if (typeof (previous_block) == null) {
        return isGenesisBlock(new_block);
    }
    else if (new_block.hash != calculateHashForBlock(new_block)) {
        return false;
    }
    else if ((previous_block === null || previous_block === void 0 ? void 0 : previous_block.hash) != new_block.previousHash) {
        return false;
    }
    return true;
};
const isValidBlockStructure = (block) => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
};
exports.isValidBlockStructure = isValidBlockStructure;
const isValidChain = (blockchainToValidate) => {
    if (!isGenesisBlock(blockchainToValidate[0])) {
        return false;
    }
    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidBlock(blockchainToValidate[i - 1], blockchainToValidate[i])) {
            return false;
        }
    }
    return true;
};
exports.isValidChain = isValidChain;
const replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        blockchain = newBlocks;
    }
};
exports.replaceChain = replaceChain;
const getBlockChain = () => {
    return blockchain;
};
exports.getBlockChain = getBlockChain;
const addBlockToChain = (newBlock) => {
    if (isValidBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
};
exports.addBlockToChain = addBlockToChain;

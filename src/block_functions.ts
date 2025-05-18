import sha256 from 'crypto-js/sha256';
import { Block } from './Block';
import {broadcastLatest} from './p2p';
import { hexToBinary } from './hexToBinary';
const calculate_hash = (index: number, previousHash: string|null, timestamp: number, data: string, difficulty:number, nonce:number): string  =>{
    if(typeof(previousHash)=='string')
        return sha256(index + previousHash + timestamp + data + difficulty + nonce).toString();
    else
        return sha256(index+''+timestamp+data).toString();
}
const BLOCK_GENERATION_INTERVAL: number = 10;

// in blocks
const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10;

const genesisBlock = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'my genesis block!!',0,0
);
let blockchain: Block[] = [genesisBlock];
const getLatestBlock =():Block=>{
    return blockchain[blockchain.length-1];
}
const generateNextBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const difficulty: number = getDifficulty(getBlockChain());
    console.log('difficulty: ' + difficulty);
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = getCurrentTimestamp();
    const newBlock: Block = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);
    addBlock(newBlock);
    broadcastLatest();
    return newBlock;
};
const hashMatchesDifficulty = (hash: string, difficulty: number): boolean => {
    const hashInBinary: string = hexToBinary(hash);
    const requiredPrefix: string = '0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
};
const calculateHashForBlock = (block:Block): string =>{
    return calculate_hash(block.index,block.previousHash,block.timestamp,block.data,block.difficulty,block.nonce);
}
const isGenesisBlock = (block:Block):boolean =>{
    return JSON.stringify(block) == JSON.stringify(genesisBlock);
}
const isValidBlock = (previous_block:Block|null, new_block:Block): boolean =>{
    if(typeof(previous_block) == null){
        return isGenesisBlock(new_block);
    }else if(new_block.hash != calculateHashForBlock(new_block)){
        return false;
    }else if(previous_block?.hash != new_block.previousHash){
        return false;
    }
    return true;
    

}
const isValidBlockStructure = (block: Block): boolean => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
};
const isValidChain = (blockchainToValidate: Block[]): boolean => {
    

    if (!isGenesisBlock(blockchainToValidate[0])) {
        return false;
    }

    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidBlock(blockchainToValidate[i-1], blockchainToValidate[i])) {
            return false;
        }
    }
    return true;
};

const replaceChain = (newBlocks: Block[]) =>{
    if(isValidChain(newBlocks) && newBlocks.length > blockchain.length){
        blockchain = newBlocks;

    }
}
const getBlockChain = (): Block[]=>{
    return blockchain;
}
const addBlockToChain = (newBlock: Block) => {
    if (isValidBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
};
const findBlock = (index: number, previousHash: string, timestamp: number, data: string, difficulty: number):Block=>{
    let nonce = 0;
    while (true) {
        const hash: string = calculate_hash(index, previousHash, timestamp, data, difficulty, nonce);
        if (hashMatchesDifficulty(hash, difficulty)) {
            return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
        }
        nonce++;
    }

}
const getCurrentTimestamp = ():number => {
    return Math.round(new Date().getTime() / 1000);
};
const getDifficulty =  (aBlockchain: Block[]):number =>{
    const latestBlock: Block = aBlockchain[blockchain.length - 1];
    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
        return getAdjustedDifficulty(latestBlock, aBlockchain);
    } else {
        return latestBlock.difficulty;
    }
}
const getAdjustedDifficulty = (latestBlock: Block, aBlockchain: Block[]) => {
    const prevAdjustmentBlock: Block = aBlockchain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken: number = latestBlock.timestamp - prevAdjustmentBlock.timestamp;
    if (timeTaken < timeExpected / 2) {
        return prevAdjustmentBlock.difficulty + 1;
    } else if (timeTaken > timeExpected * 2) {
        return prevAdjustmentBlock.difficulty - 1;
    } else {
        return prevAdjustmentBlock.difficulty;
    }
};
const addBlock = (newBlock: Block) => {
    if (isValidBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};
const isValidTimestamp = (newBlock: Block, previousBlock: Block): boolean => {
    return ( previousBlock.timestamp - 60 < newBlock.timestamp )
        && newBlock.timestamp - 60 < getCurrentTimestamp();
};
export {calculateHashForBlock,generateNextBlock,replaceChain,isValidChain,getBlockChain,isValidBlockStructure,getLatestBlock,addBlockToChain}

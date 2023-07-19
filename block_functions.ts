import sha256 from 'crypto-js/sha256';
import { Block } from './Block';
import {broadcastLatest} from './p2p';
const calculate_hash = (index: number, previousHash: string|null, timestamp: number, data: string): string  =>{
    if(typeof(previousHash)=='string')
        return sha256(index + previousHash + timestamp + data).toString();
    else
        return sha256(index+''+timestamp+data).toString();
}

const genesisBlock = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'my genesis block!!'
);
let blockchain: Block[] = [genesisBlock];
const getLatestBlock =():Block=>{
    return blockchain[blockchain.length-1];
}
const generateNextBlock = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = new Date().getTime() / 1000;
    const nextHash: string = calculate_hash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.hash, nextTimestamp, blockData);
    broadcastLatest();
    return newBlock;
};
const calculateHashForBlock = (block:Block): string =>{
    return calculate_hash(block.index,block.previousHash,block.timestamp,block.data);
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
export {calculateHashForBlock,generateNextBlock,replaceChain,isValidChain,getBlockChain,isValidBlockStructure,getLatestBlock,addBlockToChain}

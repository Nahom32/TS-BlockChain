"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnspentTxOut = exports.Transaction = exports.TxOut = exports.TxIn = void 0;
class TxOut {
    constructor(address, amount) {
        this.address = address;
        this.amount = amount;
    }
}
exports.TxOut = TxOut;
class TxIn {
    constructor() {
        this.txOutId = '';
        this.txOutIndex = 0;
        this.signature = '';
        // constructor(txOutId: string, txOutIndex: number, signature: string){
        //     this.txOutId= txOutId;
        //     this.txOutIndex = txOutIndex;
        //     this.signature = signature;
        // }
    }
}
exports.TxIn = TxIn;
class Transaction {
    constructor() {
        this.id = '';
        this.txIns = [];
        this.txOuts = [];
        // constructor(id:string, txIns:TxIn[], txOuts:TxOut[]) {
        //     this.id = id;
        //     this.txIns = txIns;
        //     this.txOuts = txOuts;
        // }
    }
}
exports.Transaction = Transaction;
class UnspentTxOut {
    constructor(txOutId, txOutIndex, address, amount) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}
exports.UnspentTxOut = UnspentTxOut;

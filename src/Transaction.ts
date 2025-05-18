class TxOut{
    public address: string;
    public amount: number;

    constructor(address: string, amount: number) {
        this.address = address;
        this.amount = amount;
    }
}

class TxIn{
    public txOutId: string='';
    public txOutIndex: number=0;
    public signature: string='';
    // constructor(txOutId: string, txOutIndex: number, signature: string){
    //     this.txOutId= txOutId;
    //     this.txOutIndex = txOutIndex;
    //     this.signature = signature;
    // }
    
}
class Transaction {
    public id: string='';
    public txIns: TxIn[]=[];
    public txOuts: TxOut[]=[];
    // constructor(id:string, txIns:TxIn[], txOuts:TxOut[]) {
    //     this.id = id;
    //     this.txIns = txIns;
    //     this.txOuts = txOuts;
    // }

}
class UnspentTxOut {
    public readonly txOutId: string;
    public readonly txOutIndex: number;
    public readonly address: string;
    public readonly amount: number;

    constructor(txOutId: string, txOutIndex: number, address: string, amount: number) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}

export {TxIn,TxOut,Transaction,UnspentTxOut}
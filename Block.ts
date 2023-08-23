class Block{
    public index: number;
    public hash: string;
    public previousHash: string|null;
    public timestamp: number;
    public data: string;
    public difficulty: number;
    public nonce: number;

    constructor(index: number, hash: string, previousHash: string|null, timestamp: number, data: string, difficulty :number, nonce: number) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
    

}
export  {Block}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import  bodyParser from 'body-parser';
const express_1 = __importDefault(require("express"));
const block_functions_1 = require("./block_functions");
const p2p_1 = require("./p2p");
const bodyParser = require('body-parser');
//const express = require('express');
const httpPort = 3001;
const p2pPort = 6001;
const initHttpServer = (myHttpPort) => {
    const app = (0, express_1.default)();
    app.use(bodyParser.json());
    app.get('/blocks', (req, res) => {
        res.send((0, block_functions_1.getBlockChain)());
    });
    app.post('/mineBlock', (req, res) => {
        const newBlock = (0, block_functions_1.generateNextBlock)(req.body.data);
        res.send(newBlock);
    });
    app.get('/peers', (req, res) => {
        res.send((0, p2p_1.getSockets)().map((s) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        (0, p2p_1.connectToPeers)(req.body.peer);
        res.send();
    });
    app.listen(myHttpPort, () => {
        console.log('Listening http on port: ' + myHttpPort);
    });
};
initHttpServer(httpPort); // start the HTTP server for REST API calls and queries to
(0, p2p_1.initP2PServer)(p2pPort);

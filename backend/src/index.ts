// const express = require('express');
// const { Server } = require('socket.io');
// const http = require('http');
// const { UserManager } = require('./manager/UserManagers');
import { Socket } from "socket.io";
import http from "http";
import express from 'express'
import { Server } from "socket.io";
import { UserManager } from "./manager/UserManagers";
import { clear } from "console";

const app = express();
const server = http.createServer(http);

const io = new Server(server, {
  cors : {
    origin : "*"
  }
});

const userManager = new UserManager();


io.on('connection', (socket:Socket) => {
  console.log('a user connected');
  // console.log('a user connected');
  userManager.addUser("name",socket);
  socket.on("disconnect", () => {
    userManager.removeUser(socket.id);
  })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
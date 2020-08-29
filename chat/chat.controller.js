const { Chat } = require('./chat.model'),
  app = require('express')(),
  server = require('http').Server(app),
  io = require('socket.io')(server);

module.exports = {
  chatHistory
};

// Chat history on the basis of sender id or receiver id
async function chatHistory(req, res) {
  try {
    if (!req.body.senderId || !req.body.receiverId) {
      global.apiResponder(req, res, 400, 'please fill required fields.');
    }
    // Find messages from db
    let message = await Chat.findOne({
      $or: [
        {
          $and: [
            {
              senderId: req.body.senderId
            },
            {
              receiverId: req.body.receiverId
            }
          ]
        },
        {
          $and: [
            {
              senderId: req.body.receiverId
            },
            {
              receiverId: req.body.senderId
            }
          ]
        }
      ]
    },
      {
        message: 1
      });
    global.apiResponder(req, res, 200, 'chat history.', message);
  } catch (error) {
    global.apiResponder(req, res, 400, error);
  }
}

//------------------- Socket intergration--------------------//
let onlineUsers = {};
let sockets = {};
// Create connection b/w socket backend and socket integrated on frontend.
io.sockets.on('connection', function (socket) {
  // Once socket is connected and socket id is genrated after which message has to be send.
  console.log("socket is connected", socket.id);
  socket.on('initChat', (data) => {
    console.log("init dataa", data)
    sockets[socket.id] = { data: data, socket: socket };
    onlineUsers[data._id] = { socketId: socket.id, userId: data._id, userName: data.userName };
    console.log('Online Users---->' + JSON.stringify(onlineUsers));

  });

  /*===========Send message event==================*/
  socket.on('sendmessage', async (data) => {
    let chatData = await Chat.findOne({
      $or: [
        {
          $and: [
            {
              senderId: data.senderId
            },
            {
              receiverId: data.receiverId
            }
          ]
        },
        {
          $and: [
            {
              senderId: data.receiverId
            },
            {
              receiverId: data.senderId
            }
          ]
        }
      ]
    });
    if (!chatData) {
      let message = []
      io.sockets.emit('message', data)
      message.push({ 'message': data.message, 'senderId': data.senderId, 'receiverId': data.receiverId, 'createdAt': data.createdAt })
      data.message = message
      await Chat.create(data);
    } else {
      let updateData = await Chat.findOneAndUpdate({
        $or: [
          {
            $and: [
              {
                senderId: data.senderId
              },
              {
                receiverId: data.receiverId
              }
            ]
          },
          {
            $and: [
              {
                senderId: data.receiverId
              },
              {
                receiverId: data.senderId
              }
            ]
          }
        ]
      },
        {
          $push: {
            message: {
              message: data.message,
              senderId: data.senderId,
              receiverId: data.receiverId,
              createdAt: data.createdAt
            }
          }
        },
        {
          new: true
        });
      if (updateData)
        io.sockets.emit('message', data)
    }
  });
  /*=====================================*/

  socket.on('chatHistory', async (data) => {
    if (!data.senderId || !data.receiverId)
      console.log("please fill required fields")
    else {
      let historyData = await Chat.findOne({
        $or: [
          {
            $and: [
              {
                senderId: data.senderId
              },
              {
                receiverId: data.receiverId
              }
            ]
          },
          {
            $and: [
              {
                senderId: data.receiverId
              },
              {
                receiverId: data.senderId
              }
            ]
          }
        ]
      });

      (!historyData) ? socket.emit('showOldermessage', 'No Date Found.') : socket.emit('showOldermessage', historyData);
    }
  })

  // App/web get logged out then disconnect ith this function.
  //---------------Disconnect events--------------------------//
  socket.on('disconnect', () => {
    let socketId = socket.id;
    if (sockets[socketId] != undefined) {
      delete onlineUsers[sockets[socketId].data.userId];
      console.log(" users deleted" + JSON.stringify(onlineUsers));
    } else {
      console.log("not deleted-----");
    }

    console.log('connection disconnected');
  })

});

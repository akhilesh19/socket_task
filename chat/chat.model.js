var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatschema = new Schema({
	senderId:{
  type:mongoose.Schema.Types.ObjectId
 },
	receiverId:{
  type:mongoose.Schema.Types.ObjectId
 },
	status:{
  type:String,
  default:"ACTIVE"
 },
	message:[{
		id:{
			type:mongoose.Schema.Types.ObjectId
		},
		message:{
			type:String
		},
		isActive:{
			type:Boolean,
			default:true
		},
		receiverId:{
			type:String
		},
		senderId:{
			type:String
		},
		createdAt:{
			type:String
		}
	}]
},{
    timestamps: true
})

let Chat = mongoose.model('Chat', chatschema);

module.exports = { Chat };
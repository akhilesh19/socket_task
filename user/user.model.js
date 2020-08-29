var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userschema = new Schema({

	userId : {
		type: mongoose.Schema.Types.ObjectId
	},
	name: {
		type: String
	},
	email: {
		type: String
	},
	isActive:{
		type:Boolean,
		default:true
	},
	status:{
		type:String,
		default:"I am currently using socket."
	},
	password:{
		type:String,
		require:true
	},
	image:{
		type:String,
		require:true
	}
},{
  timestamps: true
});

var User = mongoose.model('User', userschema);

module.exports = { User };

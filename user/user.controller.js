const { User } = require('./user.model');

module.exports = {
  createUser,
  userList,
  login
};

// Create a new user.
async function createUser(req, res) {
  try {
    let userData = await User.create(req.body);
    global.apiResponder(req, res, 201, 'Successfully created driver.', userData);
  } catch (e) {
    console.log(e)
    global.apiResponder(req, res, 400, e);
  }
}

// Users list
async function userList(req, res) {
  try {
    let listData = await User.find({});
    global.apiResponder(req, res, 200, 'User list.', listData);
  } catch (e) {
    global.apiResponder(req, res, 400, e);
  }
}

// user login
async function login(req, res) {
  try {
    let loginData = await User.findOne({ email: bdy.email, password: bdy.password });
    global.apiResponder(req, res, 200, 'Login successfully.', loginData);
  } catch (e) {
    global.apiResponder(req, res, 400, e);
  }
}
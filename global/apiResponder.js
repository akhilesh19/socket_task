module.exports = {
 apiResponder: (req, res, code, message, data) => {
   if (message.code === 11000) {
     message = message.errmsg;
   } else if (
     message.code &&
     typeof message.code !== 'string' &&
     message.message
   ) {
     code = message.code;
     data = message.data ? message.data : ``;
     message = message.message;
   }

   if (!res) {
     // Cases when chain of multiple globalresponder is called, but only the
     // first one given back to client.
     return;
   }

   return res.status(code).send({
     code,
     message,
     data
   });
 }
};

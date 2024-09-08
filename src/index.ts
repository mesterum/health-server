import { mongoose } from "@typegoose/typegoose";
import './config/passport.js'

import { uriDb, PORT } from './config/passport.js';
import app from "./app.js";

const connection = mongoose.connect(uriDb)
connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`),
  )
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  port: process.env.PORT,
  mongoURL: process.env.MONGODB_URL,
  mondayAPIKey: process.env.MONDAY_API_KEY,
  boardID: process.env.BOARD_ID,
  groupID: process.env.GROUP_ID,
  columnID: process.env.COLUMN_ID,
};

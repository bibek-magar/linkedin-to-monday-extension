const mondaySdk = require('monday-sdk-js');
const { v1: uuidv1 } = require('uuid');
const { mondayAPIKey, groupID, boardID } = require('../../config');

const token = mondayAPIKey;
const NAME_COLUMN_ID = 'text35';
const EMAIL_COLUMN_ID = 'text3';
const COMPANY_COLUMN_ID = 'dup__of_url';
const URL_COLUMN_ID = 'text0';

const createItem = async (name, url, company, email) => {
  const columnValues = {
    [NAME_COLUMN_ID]: name,
    [EMAIL_COLUMN_ID]: email,
    [COMPANY_COLUMN_ID]: company,
    [URL_COLUMN_ID]: url,
  };
  try {
    const mondayClient = mondaySdk({ token });
    const query = `
      mutation {
        create_item(
          board_id: ${boardID},
          group_id: ${groupID},
          item_name: "${uuidv1()}",
          column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}"
        ) {
          id
          name
          column_values {
            id
            title
            value
          }
        }
      }
       `;

    const response = await mondayClient.api(query);
    const { id } = response.data.create_item;
    const createdItem = {
      id,
      name,
    };
    return createdItem;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createItem };

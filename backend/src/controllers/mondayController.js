const monday = require('../utils/monday');
const { v1: uuidv1 } = require('uuid');
const ItemModel = require('../models/Item');

const NAME_COLUMN_ID = 'text35';
const EMAIL_COLUMN_ID = 'text3';
const COMPANY_COLUMN_ID = 'dup__of_url';
const URL_COLUMN_ID = 'text0';

const BOARD_ID = 4189447431;
const GROUP_ID = 'new_group37570';

const createItem = async (_, args) => {
  const { name, url, company, email } = args;

  const columnValues = {
    [NAME_COLUMN_ID]: name,
    [EMAIL_COLUMN_ID]: email,
    [COMPANY_COLUMN_ID]: company,
    [URL_COLUMN_ID]: url,
  };

  const res = await monday.api(`
    mutation {
      create_item(
        board_id: ${BOARD_ID},
        group_id: ${GROUP_ID},
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
  `);

  const { id, column_values } = res.data.create_item;
  const createdItem = {
    id,
    name,
  };
  return createdItem;
};

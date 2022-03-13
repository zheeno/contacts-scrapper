const _ = require("lodash");
const moment = require("moment");
const { ContactScanService } = require("../services/ContactScanService");
const { objectCleaner } = require("./factory/operations");
const json2xls = require('json2xls');
const fs = require("fs");

module.exports.new_contact_from_memory = (req, res, next) => {
  try {
    const contactService = new ContactScanService();
    contactService.scan().then((contacts) => {
      if (_.isEmpty(contacts))
        return res
          .status(400)
          .json({ message: "Unable to create contacts: Empty list returned" });
      const merged = _.flatten(contacts.map(c => c.data))
      // claan data object
      const cleaned = _.map(merged, function (c) {
        ["Group Membership", "Given Name"].forEach(e => delete c[e])
        return objectCleaner(c)
      })
      // merge all contacts into one large pool
      console.log("Merging all contacts", _.size(cleaned))
      const data = [
        {
          "Name": "--- ---",
          "Phone 1 - Value": "--- ---",
          "Phone 2 - Value": "--- ---",
          "Email": "--- ---",
        }
        , ..._.sortBy(cleaned, ['Name'])]
      var xls = json2xls(data);
      const fileName = `./output/CONTACT_LIST_${moment().format("YYYYMMDDhhmmss")}.xlsx`
      fs.writeFileSync(fileName, xls, 'binary');
      res.status(200).json({
        message: `Successfully extracted ${_.size(cleaned)} contacts from ${_.size(contacts)} contact files`,
        details: `File exported to ${fileName}`,
        contacts: data
      })
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

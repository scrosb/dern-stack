// Load the AWS SDK for JS
var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

// -----------------------------------------
// Create the Service interface for dynamoDB
var dynamodb = new AWS.DynamoDB({apiVersion: "2012-08-10"});

var params = {
  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "S"
    },
    {
      AttributeName: "email",
      AttributeType: "S"
    }
  ],
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH"
    },
    {
      AttributeName: "email",
      KeyType: "RANGE"
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: "basicUsersTable"
};

// Create the table.
dynamodb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table Created", data);
  }
});

// Load the AWS SDK for JS
var AWS = require("aws-sdk");

AWS.config.update({region: 'us-east-1'});
const tableName = "basicUsersTable"

const dynamodb = new AWS.DynamoDB.DocumentClient();

let getUserById = async (id) => {
    let user;
    try{
        const result = await dynamodb.query({
            TableName:tableName,
            KeyConditionExpression:"id = :id",
            ExpressionAttributeValues: {
                ":id": id
            }, 
        }).promise();

        user = result.Items[0];

    } catch (err){       
        console.error(err);
    }

    return user;
}

let getUserByEmail = async (email) => {
    let user;

    var params = {
        TableName:tableName,
        IndexName: "email-createdAt-index",
        KeyConditionExpression:"email = :email",
        ExpressionAttributeValues: {
            ":email": email
        }, 
    }
    try{
        const result = await dynamodb.query(params).promise();
        user = result.Items[0];
    } catch (err){       
        console.error(err);
    }

    return user;
}

let createUser = async (user) => {     
    let result;   
      try{
         result = await dynamodb.put({
          TableName: tableName,
          Item: user,
        }).promise();
      } catch(error){
        console.error(error);
        return result;
      }

      return result;
}


module.exports = { getUserById,createUser,getUserByEmail };
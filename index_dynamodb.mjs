// Load the AWS SDK for Node.js
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
// Create the DynamoDB service object
const client = new DynamoDBClient({
    region: "ap-southeast-2"
});
'use strict';
console.log('Loading hello world function');


export const handler = async (event) => {
    let name = "you";
    let city = 'World';
    let time = 'day';
    let day = '';
    let responseCode = 200;
    console.log("request: " + JSON.stringify(event));

    if (event.queryStringParameters && event.queryStringParameters.name) {
        console.log("Received name: " + event.queryStringParameters.name);
        name = event.queryStringParameters.name;
    }

    if (event.queryStringParameters && event.queryStringParameters.city) {
        console.log("Received city: " + event.queryStringParameters.city);
        city = event.queryStringParameters.city;
    }

    if (event.headers && event.headers['day']) {
        console.log("Received day: " + event.headers.day);
        day = event.headers.day;
    }

    if (event.body) {
        let body = JSON.parse(event.body)
        if (body.time)
            time = body.time;
    }

    let greeting = `Good ${time}, ${name} of ${city}.`;
    if (day) greeting += ` Happy ${day}!`;

    let responseBody = {
        message: greeting,
        input: event
    };

    // The output from a Lambda proxy integration must be
    // in the following JSON object. The 'headers' property
    // is for custom response headers in addition to standard
    // ones. The 'body' property  must be a JSON string. For
    // base64-encoded payload, you must also set the 'isBase64Encoded'
    // property to 'true'.
    let response = {
        statusCode: responseCode,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: JSON.stringify(responseBody)
    };
    console.log("response: " + JSON.stringify(response))

    let params = {
        TableName: 'HelloWorldTable',
        Item: {
            'id': {N: new Date().valueOf().toString()},
            'name' : {S: name},
            'city' : {S: city}
        }
      };
      console.log("params: ", params)
      const putItemCommand = new PutItemCommand(params); 
  
      try {
          const data = await client.send(putItemCommand);
          console.log("Item added successfully:", JSON.stringify(data, null, 2));
        } catch (err) {
          console.error("Error adding item:", err);
      };

    return response;
};
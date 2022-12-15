// Name: Choose DDB Table
// Author: Eduard Uffelmann
// Twitter: @schmedu_

import "@johnlindquist/kit"

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const REGION = "eu-central-1"; //e.g. "us-east-1"
const ddbClient = new DynamoDBClient({
    region: REGION,
});
export { ddbClient };
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";

try {
    const data = await ddbClient.send(new ListTablesCommand({}));
    await inspect({ data });
    let table = await arg("Which table?", data.TableNames);
    }
    // console.log(data.TableNames.join("\n"));
} catch (err) {
    notify(err);
}

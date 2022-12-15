// Name: Mute Lambda by setting concurrency to 0
// Author: Eduard Uffelmann
// Twitter: @schmedu_

import "@johnlindquist/kit";
// @ts-ignore
import AWS from "aws-sdk";

const lambda = new AWS.Lambda({
    region: "eu-central-1",
});

var params = {
    MaxItems: 100,
};
let data = await lambda.listFunctions(params).promise();

// await inspect({ a: data });
let funcs = data.Functions.map((f) => f.FunctionName);

let func = await arg("Mute Lambda by setting concurrency to 0", funcs);

let req = lambda
    .putFunctionConcurrency({
        FunctionName: func,
        ReservedConcurrentExecutions: 0,
    })
    .promise();

await inspect({ a: req });

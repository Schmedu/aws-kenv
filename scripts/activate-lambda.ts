// Name: Activate Lambda by setting concurrency to unreserved account concurrency
// Author: Eduard Uffelmann
// Twitter: @schmedu_

import "@johnlindquist/kit";
// @ts-ignore
import AWS from "aws-sdk";
import { getRegion } from "../../../lib/aws";

const lambda = new AWS.Lambda({
    region: await getRegion(),
});

var params = {
    MaxItems: 100,
};
let data = await lambda.listFunctions(params).promise();

let funcs = data.Functions.map((f) => f.FunctionName);

let func = await arg(
    {
        name: "Mute Lambda by setting concurrency to 0",
        flags: {
            all: {
                name: "All with Stack name",
                description: "Stop all Lambdas with a given Stack name",
                shortcut: "cmd + a",
            },
        },
    },
    funcs
);

let req = await lambda
    .deleteFunctionConcurrency({ FunctionName: func })
    .promise();

if (flag.all) {
    let stack = func.split("-")[0];
    let funcs = data.Functions.filter((f) => f.FunctionName.startsWith(stack));
    await inspect({ funcs });
    let reqs = funcs.map(async (f) => {
        return await lambda
            .deleteFunctionConcurrency({ FunctionName: f.FunctionName })
            .promise();
    });
    await inspect({ reqs });
}

await inspect({ req });

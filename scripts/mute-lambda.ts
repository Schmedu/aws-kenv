// Name: Mute Lambda by setting concurrency to 0
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

if (flag?.all) {
    let stack = func.split("-")[0];
    let funcs = data.Functions.filter((f) => f.FunctionName.startsWith(stack));

    await inspect({ funcs });

    let reqs = funcs.map(async (f) => {
        return await lambda
            .putFunctionConcurrency({
                FunctionName: f.FunctionName,
                ReservedConcurrentExecutions: 0,
            })
            .promise();
    });
    await inspect({ reqs });
} else {
    let req = await lambda
        .putFunctionConcurrency({
            FunctionName: func,
            ReservedConcurrentExecutions: 0,
        })
        .promise();
    await inspect({ req });
}

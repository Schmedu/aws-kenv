// Name: Disable DDB Streams
// Author: Eduard Uffelmann
// Twitter: @schmedu_

import "@johnlindquist/kit";
// @ts-ignore
import {
    DynamoDBStreamsClient,
    ListStreamsCommand,
} from "@aws-sdk/client-dynamodb-streams";
import { getRegion } from "../../../lib/aws";

const client = new DynamoDBStreamsClient({ region: await getRegion() });

let streams = await client.send(new ListStreamsCommand({}));

await inspect({ streams });

let stream = await arg(
    "Select stream",
    streams.Streams.map((s) => {
        return {
            value: s.StreamArn,
            preview: s.StreamArn,
            name: s.StreamArn,
            description: s.TableName,
        };
    })
);

// streams.Streams?.map(async (stream) => {
//     if (stream.StreamArn) {
//         await exec(`aws dynamodbstreams update-stream --stream-arn ${stream.StreamArn} --stream-enabled false`);
//     }
// });

// var params = {
//     Limit: 100,
// };
// let data = await dynamodbstreams.listStreams(params).promise();
// let data = await dynamodbstreams.listStreams({}).promise();
//
// let funcs = data.Functions.map((f) => f.FunctionName);
//
// let func = await arg(
//     {
//         name: "Mute Lambda by setting concurrency to 0",
//         flags: {
//             all: {
//                 name: "All with Stack name",
//                 description: "Stop all Lambdas with a given Stack name",
//                 shortcut: "cmd + a",
//             },
//         },
//     },
//     funcs
// );
//
// if (flag?.all) {
//     let stack = func.split("-")[0];
//     let funcs = data.Functions.filter((f) => f.FunctionName.startsWith(stack));
//
//     await inspect({ funcs });
//
//     let reqs = funcs.map(async (f) => {
//         return await dynamodbstreams
//             .putFunctionConcurrency({
//                 FunctionName: f.FunctionName,
//                 ReservedConcurrentExecutions: 0,
//             })
//             .promise();
//     });
//     await inspect({ reqs });
// } else {
//     let req = await dynamodbstreams
//         .putFunctionConcurrency({
//             FunctionName: func,
//             ReservedConcurrentExecutions: 0,
//         })
//         .promise();
//     await inspect({ req });
// }

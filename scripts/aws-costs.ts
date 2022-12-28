// Name: Get monthly aws costs
// Author: Eduard Uffelmann
// Twitter: @schmedu_

import "@johnlindquist/kit";

import {
    CostExplorerClient,
    GetCostAndUsageCommand,
} from "@aws-sdk/client-cost-explorer";
import { getRegion } from "../../../lib/aws"; // ES Modules import

const client = new CostExplorerClient({ region: await getRegion() });
const date = new Date();
date.setDate(1);
const startDate = date.toISOString().split("T")[0];
const today = new Date().toISOString().split("T")[0];

const command = new GetCostAndUsageCommand({
    TimePeriod: {
        Start: startDate,
        End: today,
    },
    Granularity: "MONTHLY",
    Metrics: ["UnblendedCost"],
});
const response = await client.send(command);

notify({
    title: "AWS costs",
    message:
        response.ResultsByTime[0].Total.UnblendedCost.Amount.slice(0, 4) + "€",
});

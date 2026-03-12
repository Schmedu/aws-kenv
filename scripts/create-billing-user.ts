// Name: Create AWS Billing User
// Description: Creates an IAM user with billing and cost management permissions
// Input: Username for the new IAM user
// Output: IAM user with billing access and access keys
// Tags: aws, iam, billing, cost-management
// Author: Eduard Uffelmann
// Twitter: @schmedu_
// Linkedin: https://www.linkedin.com/in/euffelmann/
// Website: https://schmedu.com

import "@johnlindquist/kit";
import {
  IAMClient,
  CreateUserCommand,
  CreateAccessKeyCommand,
  AttachUserPolicyCommand,
} from "@aws-sdk/client-iam";
import { getRegion } from "../../../lib/aws";

const iamClient = new IAMClient({ region: await getRegion() });

// Get username from user
const username = await arg("Enter username for the new IAM user:");

try {
  // Create the IAM user
  console.log(`Creating IAM user: ${username}`);
  const createUserCommand = new CreateUserCommand({
    UserName: username,
  });

  const userResult = await iamClient.send(createUserCommand);
  console.log(`✅ Created IAM user: ${username}`);

  // Create access keys for the user
  console.log("Creating access keys...");
  const createAccessKeyCommand = new CreateAccessKeyCommand({
    UserName: username,
  });

  const accessKeyResult = await iamClient.send(createAccessKeyCommand);
  console.log("✅ Created access keys");

  // Attach billing policy to the user
  console.log("Attaching billing policy...");
  const attachPolicyCommand = new AttachUserPolicyCommand({
    UserName: username,
    PolicyArn: "arn:aws:iam::aws:policy/AWSBillingReadOnlyAccess",
  });

  await iamClient.send(attachPolicyCommand);
  console.log("✅ Attached billing policy");

  // Show results
  await inspect({
    user: {
      username: username,
      arn: userResult.User?.Arn,
      userId: userResult.User?.UserId,
    },
    accessKeys: {
      accessKeyId: accessKeyResult.AccessKey?.AccessKeyId,
      secretAccessKey: accessKeyResult.AccessKey?.SecretAccessKey,
    },
    policy: {
      name: "AWSBillingReadOnlyAccess",
      description: "Provides read-only access to billing and cost management",
    },
  });

  notify({
    title: "AWS Billing User Created",
    body: `User ${username} created with billing access`,
  });
} catch (error) {
  console.error("Error creating billing user:", error);
  notify({
    title: "Error",
    body: `Failed to create billing user: ${error.message}`,
  });
}

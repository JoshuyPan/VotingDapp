const generatePTBCommand = ({ packageId, adminCapId, dashboardId, numProposals }) => {
  let command = "sui client ptb";

  for (let i = 1; i <= numProposals; i++) {
    // Generate timestamp: current date + 1 year + incremental seconds
    const currentDate = new Date();
    const oneYearFromNow = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
    const timestamp = oneYearFromNow.getTime() + i * 1000; // Add 1 second per proposal
    const timestampId = Math.floor(Math.random() * 100000 * i);

    const title = `Proposal ${timestampId}`;
    const description = `Proposal description ${timestampId}`;

    // Add proposal creation command
    command += ` \\
  --move-call ${packageId}::proposal::create \\
  @${adminCapId} \\
  '"${title}"' '"${description}"' ${timestamp} \\
  --assign proposal_id`;

    // Add dashboard registration command
    command += ` \\
  --move-call ${packageId}::dashboard::register_proposal \\
  @${dashboardId} \\
  @${adminCapId} proposal_id`;
  }

  return command;
};

// Inputs
const inputs = {
  packageId: "0x12a35086460b7474372b60f9df3d557e9f4a8fa961b3b516aa34e438c83fd893",
  adminCapId: "0xeee1d86010bb0610c487a59c1cfd28afa33beffa808c4e8b1d814453e0f562e8",
  dashboardId: "0xd789ccb38840ef790626e175809db193b8c99ed15edce90b32e2d9e035581ef4",
  numProposals: 3, // Specify the number of proposals to generate
};

// Generate the command
const ptbCommand = generatePTBCommand(inputs);
console.log(ptbCommand);
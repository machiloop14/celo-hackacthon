const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  const deploymentFile = path.join(__dirname, `../deployments/${network}.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.error(`No deployment found for network: ${network}`);
    console.log("Please deploy the contract first: npm run deploy:alfajores");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  console.log(`\n📋 Deployment Information for ${network}:`);
  console.log("=" .repeat(50));
  console.log(`Contract Address: ${deployment.contractAddress}`);
  console.log(`Deployer: ${deployment.deployer}`);
  console.log(`Deployed At: ${deployment.timestamp}`);
  console.log("=" .repeat(50));

  // Verify contract is accessible
  try {
    const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
    const contract = PredictionMarket.attach(deployment.contractAddress);
    const marketCount = await contract.marketCount();
    console.log(`\n✅ Contract is accessible`);
    console.log(`Current market count: ${marketCount.toString()}`);
    console.log(`\n💡 Add this to your frontend/.env.local:`);
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${deployment.contractAddress}`);
  } catch (error) {
    console.error("\n❌ Error accessing contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });





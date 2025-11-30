const hre = require("hardhat");

async function main() {
  console.log("Deploying PredictionMarket contract...");

  // cUSD token addresses for different networks
  const CUSD_ADDRESSES = {
    sepolia: "0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b", // Celo Sepolia testnet
    mainnet: "0x765DE816845861e75A25fCA122bb6898B8B1282a", // Celo mainnet
  };

  const networkName = hre.network.name;
  const cusdAddress = CUSD_ADDRESSES[networkName] || CUSD_ADDRESSES.sepolia;

  console.log(
    `Using cUSD token address: ${cusdAddress} for network: ${networkName}`
  );

  const PredictionMarket =
    await hre.ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(cusdAddress);

  await predictionMarket.deployed();

  console.log("PredictionMarket deployed to:", predictionMarket.address);
  console.log("Network:", networkName);
  console.log("cUSD Token:", cusdAddress);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: networkName,
    contractAddress: predictionMarket.address,
    cusdTokenAddress: cusdAddress,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    `deployments/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(
    "Deployment info saved to deployments/" + hre.network.name + ".json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const fs = require('fs');
const path = require('path');

// Read the compiled contract artifact
const artifactPath = path.join(__dirname, '../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json');

if (!fs.existsSync(artifactPath)) {
  console.error('Contract artifact not found. Please compile the contracts first: npm run compile');
  process.exit(1);
}

const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

// Extract ABI
const abi = artifact.abi;

// Write ABI to a separate file
const abiPath = path.join(__dirname, '../frontend/contracts/PredictionMarket.json');
const abiDir = path.dirname(abiPath);

if (!fs.existsSync(abiDir)) {
  fs.mkdirSync(abiDir, { recursive: true });
}

fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
console.log('ABI exported to:', abiPath);





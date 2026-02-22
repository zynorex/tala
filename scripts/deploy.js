import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function main() {
  console.log("🚀 Starting TALAVault deployment...\n");

  // Get provider from hardhat
  const provider = ethers.getDefaultProvider("https://rpc-amoy.polygon.technology/");
  
  // Get private key from env
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not set in .env");
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);
  const deployer = wallet;
  console.log(`📝 Deploying contract from account: ${deployer.address}`);

  // Get account balance
  const balance = await provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} MATIC\n`);

  // Read and compile the contract
  console.log("⏳ Deploying TALAVault contract...");
  
  // Get the contract bytecode and ABI from the artifacts
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "TALAVault.sol", "TALAVault.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const talaVault = await factory.deploy();
  await talaVault.waitForDeployment();

  const contractAddress = await talaVault.getAddress();
  console.log(`✅ TALAVault deployed to: ${contractAddress}\n`);

  // Save contract address to .env
  const envPath = path.join(__dirname, "..", ".env");
  const envContent = fs.readFileSync(envPath, "utf-8");
  
  // Replace or add the NEXT_PUBLIC_TALA_VAULT_ADDRESS
  const updatedEnv = envContent.includes("NEXT_PUBLIC_TALA_VAULT_ADDRESS=")
    ? envContent.replace(
        /NEXT_PUBLIC_TALA_VAULT_ADDRESS=.*/,
        `NEXT_PUBLIC_TALA_VAULT_ADDRESS=${contractAddress}`
      )
    : envContent + `\n\nNEXT_PUBLIC_TALA_VAULT_ADDRESS=${contractAddress}`;

  fs.writeFileSync(envPath, updatedEnv);
  console.log(`📝 Updated .env with contract address\n`);

  // Output deployment info
  console.log("=".repeat(50));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  console.log(`Network: Polygon Amoy (ChainId: 80002)`);
  console.log(`Contract: TALAVault`);
  console.log(`Address: ${contractAddress}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log("=".repeat(50));
  console.log("\n✨ Deployment complete! Contract address saved to .env");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

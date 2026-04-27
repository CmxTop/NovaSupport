import "dotenv/config";
import { logger } from "./logger.js";

const REQUIRED_ENV_VARS = ["DATABASE_URL", "DIRECT_URL"];

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    logger.error({ variable: key }, `Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

import { app } from "./app.js";
import { startDripScheduler } from "./services/drip-scheduler.js";
import { EventIndexer } from "./services/event-indexer.js";
import { createSorobanRpcClient } from "./services/soroban-rpc-client.js";
import { prisma } from "./db.js";

const port = Number(process.env.PORT ?? 4000);
const indexerNetwork = process.env.INDEXER_NETWORK ?? "TESTNET";
const contractId =
  process.env.SOROBAN_CONTRACT_ID ??
  process.env.CONTRACT_ID ??
  process.env.NEXT_PUBLIC_CONTRACT_ID ??
  "";
const sorobanRpcUrl =
  process.env.SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org";

const eventIndexer =
  contractId.trim().length > 0
    ? new EventIndexer({
        prisma,
        rpcClient: createSorobanRpcClient(sorobanRpcUrl),
        network: indexerNetwork,
        contractId,
      })
    : null;

app.listen(port, () => {
  logger.info({ port }, `NovaSupport backend listening on http://localhost:${port}`);

  // Start the recurring drip scheduler if enabled
  startDripScheduler();

  if (eventIndexer) {
    eventIndexer.start();
    logger.info(
      { contractId, network: indexerNetwork, rpcUrl: sorobanRpcUrl },
      "Soroban event indexer started",
    );
  } else {
    logger.warn(
      "Soroban event indexer disabled - set SOROBAN_CONTRACT_ID to enable it",
    );
  }
});

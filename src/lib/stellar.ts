import * as StellarSdk from '@stellar/stellar-sdk';

// ----------------------
// 🌐 NETWORK CONFIG
// ----------------------
const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? 'testnet';

const isPublic = NETWORK === 'public';

export const horizon = new StellarSdk.Horizon.Server(
  isPublic
    ? 'https://horizon.stellar.org'
    : 'https://horizon-testnet.stellar.org'
);

export const passphrase = isPublic
  ? StellarSdk.Networks.PUBLIC
  : StellarSdk.Networks.TESTNET;

export const EXPLORER = isPublic
  ? 'https://stellar.expert/explorer/public/tx'
  : 'https://stellar.expert/explorer/testnet/tx';


// ----------------------
// 🔐 ADMIN KEY (SERVER ONLY)
// ----------------------
const SECRET = process.env.STELLAR_SECRET || '';

let keypair: StellarSdk.Keypair | null = null;

try {
  if (SECRET) {
    keypair = StellarSdk.Keypair.fromSecret(SECRET);
  }
} catch {
  console.warn('[Stellar] Invalid secret key.');
}


// ----------------------
// 💰 FETCH BALANCE
// ----------------------
export async function fetchLiveBalance(publicKey: string): Promise<string | null> {
  try {
    const account = await horizon.loadAccount(publicKey);

    const native = account.balances.find(
      (b: any) => b.asset_type === 'native'
    );

    return native ? parseFloat(native.balance).toFixed(5) : "0.00000";
  } catch (err: any) {
    if (err.response?.status === 404) return "0.00000";
    return null;
  }
}


// ----------------------
// 📜 FETCH TRANSACTIONS
// ----------------------
export async function fetchTransactions(publicKey: string) {
  try {
    const res = await horizon
      .transactions()
      .forAccount(publicKey)
      .order('desc')
      .limit(10)
      .call();

    return res.records.map((tx: any) => ({
      id: tx.id,
      hash: tx.hash,
      createdAt: tx.created_at,
      fee: tx.fee_charged,
      successful: tx.successful,
    }));
  } catch (err) {
    console.error('[Stellar] fetchTransactions failed:', err);
    return [];
  }
}


// ----------------------
// ✍️ BUILD UNSIGNED TX
// ----------------------
export async function buildUnsignedNetworkPing(publicKey: string) {
  const account = await horizon.loadAccount(publicKey);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: passphrase,
  })
    .addOperation(
      StellarSdk.Operation.manageData({
        name: 'ztk:ping',
        value: 'freighter_test',
      })
    )
    .setTimeout(30)
    .build();

  return tx.toXDR();
}


// ----------------------
// 🚀 SUBMIT SIGNED TX
// ----------------------
export async function submitSignedTransaction(signedXdr: string) {
  const tx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    passphrase
  );

  return await horizon.submitTransaction(tx as any);
}


// ----------------------
// 🔗 PROVENANCE WRITE
// ----------------------
export async function writeProvenanceRecord(
  eventType: string,
  entityId: string,
  data: Record<string, unknown>
) {
  if (!keypair) return null;

  try {
    const payload = {
      eventType,
      entityId,
      platform: 'Zytrak',
      ...data,
      timestamp: new Date().toISOString(),
    };

    const encoded = new TextEncoder().encode(JSON.stringify(payload));
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);

    const dataHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 64);

    const account = await horizon.loadAccount(keypair.publicKey());

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: passphrase,
    })
      .addOperation(
        StellarSdk.Operation.manageData({
          name: `ztk:${eventType}`.slice(0, 64),
          value: dataHash,
        })
      )
      .setTimeout(30)
      .build();

    tx.sign(keypair);

    const result = await horizon.submitTransaction(tx);

    return {
      txHash: result.hash,
      explorerUrl: `${EXPLORER}/${result.hash}`,
    };

  } catch (err) {
    console.error('[Stellar] write failed:', err);
    return null;
  }
}

export { keypair };
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

import rsaPemToJwk from 'rsa-pem-to-jwk';

// Directory for storing certificates
const certsDir = resolve('certs');

// Ensure the certs directory exists
if (!existsSync(certsDir)) {
    mkdirSync(certsDir, { recursive: true });
    console.log('Created certificates directory:', certsDir);
}

// Path to the private key file
const publicKeyPath = resolve(certsDir, 'publicKey.pem');

// Load the private key
const publicKey = readFileSync(publicKeyPath);

console.log('Loaded Private Key:', publicKey);

// Convert the private key to JWK format
const jwk = rsaPemToJwk(
    publicKey,
    { use: 'sig' }, // Specify the intended use for the key
    'public' // Indicate the key type (public or private)
);

console.log('Converted JWK:', JSON.stringify(jwk));

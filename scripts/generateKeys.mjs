import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Generate RSA key pair
const generateKeys = () => {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
    });
};

const { publicKey, privateKey } = generateKeys();

// Directory for storing certificates
const certsDir = path.resolve('certs');

// Ensure the certs directory exists
if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir);
}

// Write keys to files
fs.writeFileSync(path.join(certsDir, 'publicKey.pem'), publicKey);
fs.writeFileSync(path.join(certsDir, 'privateKey.pem'), privateKey);

console.log('Keys generated and saved to the certs directory.');

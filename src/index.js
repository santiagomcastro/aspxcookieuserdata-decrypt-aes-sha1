const { createDecipheriv, createHmac, randomBytes } = require("crypto");
const Reader = require("./reader");
const assert = require("assert");

const VALIDATION_METHOD = {
  sha1: {
    algorithm: "sha1",
    signatureSize: 20
  }
};
const DECRYPTION_METHOD = {
  aes: {
    cipher: "aes-192-cbc",
    ivSize: 16,
    headerSize: 24
  }
};

const DecryptUserDataCookie = config => {
  
  assert(config.validationKey, "'validationKey' is required.");
  assert(config.decryptionKey, "'decryptionKey' is required.");

  const VALIDATION_KEY = Buffer.from(config.validationKey, "hex");
  const DECRYPTION_KEY = Buffer.from(config.decryptionKey, "hex");
  const DECRYPTION_IV = config.decryptionIV
    ? Buffer.from(config.DECRYPTION_IV, "hex")
    : Buffer.alloc(DECRYPTION_METHOD.aes.ivSize);

  const validate = bytes => {
    const signature = bytes.slice(-VALIDATION_METHOD.sha1.signatureSize);
    const payload = bytes.slice(0, -VALIDATION_METHOD.sha1.signatureSize);

    const hash = createHmac(VALIDATION_METHOD.sha1.algorithm, VALIDATION_KEY);
    hash.update(payload);

    return hash.digest().equals(signature);
  };

  const decrypt = cookie => {
    try {
      const bytes = cookie instanceof Buffer ? cookie : Buffer.from(cookie, "hex");
      if (!validate(bytes)) {
        return "The validation key is not supported.";
      }

      const decryptor = createDecipheriv(
        DECRYPTION_METHOD.aes.cipher,
        DECRYPTION_KEY,
        DECRYPTION_IV
      );

      const payload = bytes.slice(0, -VALIDATION_METHOD.sha1.signatureSize);
      const decryptedBytes = Buffer.concat([
        decryptor.update(payload),
        decryptor.final()
      ]);

      const reader = new Reader(decryptedBytes);

      const userDataJSON = reader.readStringCustomData();

      return userDataJSON;
    } catch (error) {
      return error.message;   
    }
  };

  return {decrypt}
};

module.exports = DecryptUserDataCookie;

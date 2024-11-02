const admin = require("firebase-admin");
const { v4: uuidv4 } = require('uuid');
const path = require('node:path');

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const bucket = admin.storage().bucket("gs://medmastero-62c02.appspot.com");

async function uploadFile(path, remotePath, contentType) {
    const remoteFilePath = remotePath;

    // Upload the File
    const storage = await bucket.upload(path, {
        public: true,
        destination: remoteFilePath,
        cacheControl: 'public, max-age=31536000',
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });
    return storage[0].metadata.mediaLink;
}


async function getSignedUrl(remoteFilePath) {
    try {
        const options = {
            action: 'read',
            expires: Date.now() + 24 * 60 * 60 * 1000 * 8
        }

        // The right hand side returns an array of signedUrl
        let [signedUrl, ...urls] = await bucket.file(remoteFilePath).getSignedUrl(options);
        return signedUrl;
    } catch (error) {
        console.log("Error on getSignedUrl:  ", error);
        return null;
    }

}

module.exports = { getSignedUrl, uploadFile, bucket }

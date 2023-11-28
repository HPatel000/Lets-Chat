const { ClientEncryption } = require('mongodb-client-encryption')
const mongoose = require('mongoose')
const { Binary } = require('mongodb')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/MERNCRUD')
    console.log('MongoDB connected...')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
module.exports = connectDB
//  try {
//     const arr = []
//     for (let i = 0; i < 96; ++i) {
//       arr.push(i)
//     }
//     const key = Buffer.from(arr)
//     const keyVaultNamespace = 'client.encryption'
//     const kmsProviders = { local: { key } }
//     const uri = 'mongodb://127.0.0.1:27017'
//     const conn = await mongoose
//       .createConnection(uri, {
//         autoEncryption: {
//           keyVaultNamespace,
//           kmsProviders,
//         },
//       })
//       .asPromise()
//     const encryption = new ClientEncryption(conn.client, {
//       keyVaultNamespace,
//       kmsProviders,
//     })
//     const _key = await encryption.createDataKey('local')
//     await mongoose.connect('mongodb://127.0.0.1:27017/MERNCRUD', {
//       // Configure auto encryption
//       autoEncryption: {
//         keyVaultNamespace,
//         kmsProviders,
//         schemaMap: {
//           'MERNCRUD.Message': {
//             bsonType: 'object',
//             encryptMetadata: {
//               keyId: [_key],
//             },
//             properties: {
//               message: {
//                 encrypt: {
//                   bsonType: 'string',
//                   algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
//                 },
//               },
//             },
//           },
//         },
//       },
//     })

//     console.log('MongoDB connected...')
//   }

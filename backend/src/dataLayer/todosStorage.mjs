import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const logger = createLogger("todosStorage")

export class TodoStorage {
    constructor(
        s3Client = AWSXRay.captureAWSv3Client(new S3Client()),
        bucketName = process.env.ATTACHMENTS_S3_BUCKET,
        urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
    ) {
        this.s3Client = s3Client
        this.bucketName = bucketName
        this.urlExpiration = urlExpiration
    }

    async getUploadUrl(attachmentId) {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: attachmentId
        })
        const url = await getSignedUrl(this.s3Client, command, {
            expiresIn: this.urlExpiration
        })
        return url
    }
}

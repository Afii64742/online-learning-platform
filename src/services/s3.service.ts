import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class S3Service {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
            region: process.env.AWS_REGION,
        });
    }

    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const fileName = `${folder}/${Date.now()}-${file.originalname}`;
        
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const { Location } = await this.s3.upload(uploadParams).promise();
        return Location; // Returns the file URL
    }
}

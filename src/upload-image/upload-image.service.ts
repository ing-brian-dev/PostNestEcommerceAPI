import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './upload-image.response';
import streamifier from 'streamifier'

@Injectable()
export class UploadImageService {
    uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadSteam = cloudinary.uploader.upload_stream({
                folder: 'postNest',
                transformation: [
                    {
                        width: 800,
                        height: 800,
                        crop: 'limit',
                        fetch_format: 'auto',
                        quality: 'auto'
                    }
                ]
            },
                (error, result) => {
                    if (error) return reject(new Error(`Error uploading file to Cloudinary: ${error.message}`));
                    if (!result) return reject(new Error('No result returned from Cloudinary'));
                    resolve(result);
                }
            )
            streamifier.createReadStream(file.buffer).pipe(uploadSteam);
        });
    }
    deleteFile(publicId: string): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(new Error(`Error deleting file from Cloudinary: ${error.message}`));
                if (!result) return reject(new Error('No result returned from Cloudinary'));
                resolve(result);
            });
        });
    }
}

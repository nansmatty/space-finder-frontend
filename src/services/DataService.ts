import type { AuthService } from './AuthService';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DataStack } from '../../../space-finder/outputs.json';

export class DataService {
	private authService: AuthService;
	private s3Client: S3Client | undefined;
	private awsRegion = 'ap-south-1';

	constructor(authService: AuthService) {
		this.authService = authService;
	}

	public async createSpace(name: string, location: string, photo?: File) {
		const credentials = await this.authService.getTemporaryCredentials();
		if (photo) {
			const uploadUrl = await this.uploadPublicFile(photo);
			console.log(uploadUrl);
		}

		return '123';
	}

	private async uploadPublicFile(file: File) {
		try {
			const credentials = await this.authService.getTemporaryCredentials();

			if (!this.s3Client) {
				this.s3Client = new S3Client({
					credentials: credentials as any,
					region: this.awsRegion,
				});
			}

			const arrayBuffer = await file.arrayBuffer(); // ⬅️ convert to array buffer
			const fileName = file.name.split(' ').join('-');

			const command = new PutObjectCommand({
				Bucket: DataStack.SpaceFinderPhotosBucketName,
				Key: fileName,
				ACL: 'public-read',
				Body: arrayBuffer,
				ContentType: file.type,
			});

			await this.s3Client.send(command);

			return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`;
		} catch (error) {
			console.log({ error });
		}
	}

	public isAuthorized() {
		return true;
	}
}

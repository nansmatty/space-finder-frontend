import type { AuthService } from './AuthService';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DataStack, ApiStack } from '../../../space-finder/outputs.json';
import type { SpaceEntry } from '../model/model';

const spacesUrl = ApiStack.SpaceApiEndpointDA7E4050 + 'spaces';

export class DataService {
	private authService: AuthService;
	private s3Client: S3Client | undefined;
	private awsRegion = 'ap-south-1';
	private spaceID: string | undefined;

	constructor(authService: AuthService) {
		this.authService = authService;
	}

	public reserveSpace(spaceId: string) {
		this.spaceID = spaceId;
		return this.spaceID;
	}

	public async getSpaces(): Promise<SpaceEntry[]> {
		try {
			const getSpacesResult = await fetch(spacesUrl, {
				method: 'GET',
				headers: {
					Authorization: this.authService.jwtToken!,
				},
			});

			const getSpacesResultJSON = await getSpacesResult.json();
			console.log({ getSpacesResultJSON });
			return getSpacesResultJSON.result;
		} catch (error) {
			console.log({ getspaces_error: error });
			return [];
		}
	}

	public async createSpace(name: string, location: string, photo?: File) {
		try {
			const space = {} as any;
			space.name = name;
			space.location = location;

			if (photo) {
				const uploadUrl = await this.uploadPublicFile(photo);
				space.photoUrl = uploadUrl;
			}

			const postResult = await fetch(spacesUrl, {
				method: 'POST',
				body: JSON.stringify(space),
				headers: {
					Authorization: this.authService.jwtToken!,
				},
			});

			const postResultJSON = await postResult.json();

			return postResultJSON.message;
		} catch (error) {
			console.log({ createspace_error: error });
		}
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
		return this.authService.isAuthorized();
	}
}

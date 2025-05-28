import { fetchAuthSession, signIn } from '@aws-amplify/auth';
import type { SignInOutput } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { AuthStack } from '../../../space-finder/outputs.json';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'ap-south-1';

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: AuthStack.SpaceUserPoolId,
			userPoolClientId: AuthStack.SpaceUserPoolClientId,
			identityPoolId: AuthStack.SpaceIdentityPoolId,
		},
	},
});

export class AuthService {
	private user: SignInOutput | undefined;
	private userName: string = '';
	public jwtToken: string | undefined;
	private temporaryCredentials: object | undefined;

	public isAuthorized() {
		if (this.user) {
			return true;
		}
		return false;
	}

	public async login(userName: string, password: string): Promise<Object | undefined> {
		try {
			const signInOutput: SignInOutput = await signIn({
				username: userName,
				password,
				options: {
					authFlowType: 'USER_PASSWORD_AUTH',
				},
			});

			this.user = signInOutput;
			this.userName = userName;
			await this.generateIdToken();

			return this.user;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	public async getTemporaryCredentials() {
		if (this.temporaryCredentials) {
			return this.temporaryCredentials;
		}

		this.temporaryCredentials = await this.generateTempCredentials();
		return this.temporaryCredentials;
	}

	private async generateTempCredentials() {
		const cognitoIdentityPoolId = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolId}`;
		const cognitoIdentity = new CognitoIdentityClient({
			credentials: fromCognitoIdentityPool({
				clientConfig: {
					region: awsRegion,
				},
				identityPoolId: AuthStack.SpaceIdentityPoolId,
				logins: {
					[cognitoIdentityPoolId]: this.jwtToken!,
				},
			}),
		});

		const credentials = await cognitoIdentity.config.credentials();
		return credentials;
	}

	private async generateIdToken() {
		this.jwtToken = (await fetchAuthSession()).tokens?.idToken?.toString();
	}

	public getIdToken() {
		return this.jwtToken;
	}

	public getUserName() {
		return this.userName;
	}
}

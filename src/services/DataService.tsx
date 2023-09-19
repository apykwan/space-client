import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { AuthService } from './AuthService';

export class DataService {
  private authService: AuthService;
  // private s3Client: S3Client | undefined;
  // private awsRegion = 'us-west-w';

  constructor(authService: AuthService) {
      this.authService = authService;
  }


  public async createSpace(name: string, location: string, photo?: File) {
    const credentials = await this.authService.getTemporaryCredentials();
    console.log(credentials);
    return 123;
  }

  public isAuthorized() {
    return true;
  }
}
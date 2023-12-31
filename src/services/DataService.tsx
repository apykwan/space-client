/* eslint-disable @typescript-eslint/no-explicit-any */
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { AuthService } from './AuthService';
import { SpaceEntry } from "../components/model/model";
import { DataStack, ApiStack } from '../../../space-finder/outputs.json';

const spaceUrl =  ApiStack.SpacesApiEndpoint36C4F3B6 + 'spaces';

export class DataService {
  private authService: AuthService;
  private s3Client: S3Client | undefined;
  private awsRegion = 'us-west-2';

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public reserveSpace(spaceId: string) {
    console.log(spaceId);
    return '123';
  }

  public async getSpaces():Promise<SpaceEntry[]> {
    const getSpacesResult = await fetch(spaceUrl, {
      method: 'GET',
      headers: {
        'Authorization': this.authService.jwtToken!
      }
    });
    
    return await getSpacesResult.json();
  }

  public async createSpace(name: string, location: string, photo?: File) {
    const space = {} as SpaceEntry;
    space.name = name;
    space.location = location;

    if (photo) space.photoUrl = await this.uploadPublicFile(photo);

    const postResult = await fetch(spaceUrl, {
      method: 'POST',
      body: JSON.stringify(space),
      headers: {
        'Authorization': this.authService.jwtToken!
      }
    });

    const postResultJSON = await postResult.json();
    return postResultJSON.id;
  }

  private async uploadPublicFile(file: File) {
    const credentials = await this.authService.getTemporaryCredentials();

    if (!this.s3Client) {
      this.s3Client = new S3Client({
        credentials: credentials as any,
        region: this.awsRegion
      });
    }

    const command = new PutObjectCommand({
      Bucket: DataStack.SpaceFinderPhotosBucketName,
      Key: file.name,
      ACL: 'public-read',
      Body: file
    });
    await this.s3Client.send(command);
    return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`;
  }

  public isAuthorized() {
    return this.authService.isAuthorized();
  }
}
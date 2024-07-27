import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  welcomeRoute(): string {
    return 'App is successfully running!';
  }
}

/* eslint-disable no-console */

export type ExceptionEventParams = {
  description: string;
  fatal: boolean;
};

export type AnalyticEvents =
  | 'download_cloud'
  | 'collab_joined'
  | 'collab_cloud_created'
  | 'words_cloud_created'
  | 'text_cloud_created';

class Logger {
  private isProduction: boolean;

  private endpoint = 'https://agasdg.apigateway.aws.com/Prod';

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  logEvent(event: AnalyticEvents): void {
    if (this.isProduction) {
      const url = `${this.endpoint}/event`;

      fetch(url, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'x-api': process.env.REACT_APP_API_KEY!,
        },
        body: JSON.stringify({
          event,
        }),
      }).catch();

      return;
    }
    console.info(event);
  }

  logError(params: ExceptionEventParams): void {
    if (this.isProduction) {
      const url = `${this.endpoint}/error`;

      fetch(url, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'x-api': process.env.REACT_APP_API_KEY!,
        },
        body: JSON.stringify(params),
      }).catch();
      return;
    }
    console.error(params);
  }
}

export const logger = new Logger();

/* eslint-enable no-console */

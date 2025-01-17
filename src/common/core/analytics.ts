 

export type ExceptionEventParams = {
  description: string;
  fatal: boolean;
};

export type AnalyticEvents =
  | 'download_cloud'
  | 'collab_joined'
  | 'collab_cloud_created'
  | 'words_cloud_created'
  | 'text_cloud_created'
  | 'collab_rejoined';

class Logger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  logEvent(event: AnalyticEvents): void {
    if (this.isProduction) {
      return;
    }
    console.info(event);
  }

  logError(params: ExceptionEventParams): void {
    if (this.isProduction) {
      return;
    }
    console.error(params);
  }
}

export const logger = new Logger();

 

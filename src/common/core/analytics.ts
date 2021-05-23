/* eslint-disable no-console */
import { analytics } from '../../firebase';

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
  private googleLogger?: firebase.analytics.Analytics;

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.googleLogger = analytics();
    }
  }

  logEvent(event: AnalyticEvents): void {
    if (this.googleLogger) {
      return this.googleLogger.logEvent<AnalyticEvents>(event);
    }
    return console.info(event);
  }

  logError(params: ExceptionEventParams): void {
    if (this.googleLogger) {
      return this.googleLogger.logEvent('exception', params);
    }
    return console.error(params);
  }
}

export const logger = new Logger();

/* eslint-enable no-console */

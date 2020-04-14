import { Cloud, CloudConfig, CloudInput } from '../utils/cloud/cloud.types';
import { WordCount } from '../context/form/formsReducer.types';

export interface AnalyticsDTO {
  data: string | CloudInput[];
  type: 'words' | 'text';
  time?: Date;
}

const baseUrl = '/api';

export class API {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async createCloud(words: WordCount, config?: CloudConfig): Promise<Cloud[]> {
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ words, config }),
    };

    const url = `${this.url}/cloud`;
    const response = await fetch(url, init);

    if (!response.ok) {
      const { status } = response;
      throw new Error(status.toString());
    }

    return response.json();
  }

  async analytics(data: AnalyticsDTO): Promise<AnalyticsDTO> {
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    };

    const url = `${this.url}/analytics`;
    const response = await fetch(url, init);

    if (!response.ok) {
      const { status } = response;
      throw new Error(status.toString());
    }

    return response.json();
  }
}

export const apiService = new API(baseUrl);

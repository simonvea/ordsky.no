import { Cloud } from '../utils/cloud/cloud.types';
import { WordCount } from '../context/form/formsReducer.types';

const baseUrl = '/api';

export class API {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async createCloud(words: WordCount): Promise<Cloud[]> {
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ words }),
    };

    const url = `${this.url}/cloud`;
    const response = await fetch(url, init);

    if (!response.ok) {
      const { status } = response;
      throw new Error(status.toString());
    }

    return response.json();
  }
}

export const apiService = new API(baseUrl);

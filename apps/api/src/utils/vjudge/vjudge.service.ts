import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import FormData from 'form-data';
import { OJName } from '@/problem/problem.service';
import { ConfigService } from '@nestjs/config';

const jar = new CookieJar();
const axiosClient = wrapper(axios.create({ jar }));

@Injectable()
export class VjudgeService {
  constructor(private readonly configService: ConfigService) {}

  async login() {
    const email = this.configService.get<string>('VJUDGE_EMAIL');
    const password = this.configService.get<string>('VJUDGE_PASSWORD');

    const loginFormData = new FormData();
    loginFormData.append('username', email);
    loginFormData.append('password', password);

    try {
      const res = await axiosClient({
        method: 'post',
        url: 'https://vjudge.net/user/login',
        data: loginFormData,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      console.log('login result is ', res.data);
    } catch (err: any) {
      console.log('login error ', err.message);
    }
  }

  async submitCode({
    ojName,
    ojProblemId,
    codeStr,
  }: {
    ojName: string;
    ojProblemId: string;
    codeStr: string;
  }) {
    const submitFormData = new FormData();
    submitFormData.append('method', '0');
    submitFormData.append('open', '1');
    submitFormData.append('oj', ojName);
    submitFormData.append('probNum', ojProblemId);
    submitFormData.append('captcha', '');
    submitFormData.append('source', codeStr);

    if (ojName === OJName.UVA) {
      submitFormData.append('language', '5');
    } else if (ojName === OJName.LOJ) {
      submitFormData.append('language', 'cpp14');
    }

    try {
      const res = await axiosClient({
        url: 'https://vjudge.net/problem/submit',
        method: 'post',
        data: submitFormData,
        withCredentials: true,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      return res.data;
    } catch (err: any) {
      console.log('submitCode error', err.message);
    }
  }

  async solution({ runId }: { runId: string }) {
    // const processing = true;
    // let res: AxiosResponse<any, any>;
    // while (processing) {
    try {
      const res = await axiosClient({
        url: `https://vjudge.net/solution/data/${runId}`,
        method: 'get',
        withCredentials: true,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      // processing = res.data.processing;
      // }
      return res.data;
    } catch (err: any) {
      console.log('solution error', err.message);
    }
  }
}

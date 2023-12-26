import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import FormData from 'form-data';

const jar = new CookieJar();
const axiosClient = wrapper(axios.create({ jar }));

@Injectable()
export class VjudgeService {
  async login() {
    const loginFormData = new FormData();
    loginFormData.append('username', 'arifuzzamannishan@gmail.com');
    loginFormData.append('password', 'Anishan38@@');

    const res = await axiosClient({
      method: 'post',
      url: 'https://vjudge.net/user/login',
      data: loginFormData,
    });
    console.log(res.data);
  }

  async submitCode({
    ojName,
    problemNum,
    code,
  }: {
    ojName: string;
    problemNum: string;
    code: string;
  }) {
    const submitFormData = new FormData();
    submitFormData.append('method', '0');
    submitFormData.append('language', 'cpp14');
    submitFormData.append('open', '1');
    submitFormData.append('oj', ojName);
    submitFormData.append('probNum', problemNum);
    submitFormData.append('captcha', '');
    submitFormData.append('source', code);

    const res = await axiosClient({
      url: 'https://vjudge.net/problem/submit',
      method: 'post',
      data: submitFormData,
      withCredentials: true,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
    });
    return res.data;
  }

  async solution({ runId }: { runId: string }) {
    let processing = true;
    let res: AxiosResponse<any, any>;
    while (processing) {
      res = await axiosClient({
        url: `https://vjudge.net/solution/data/${runId}`,
        method: 'get',
        withCredentials: true,
      });
      processing = res.data.processing;
    }
    return res.data;
  }
}

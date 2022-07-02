import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/** 登入類型 */
export enum LoginType {
  SYSTEM,
  Google
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  loginType: LoginType = LoginType.SYSTEM;

  constructor(private httpClient: HttpClient) { }

  /** 模擬取得 clientSecret 的 API */
  getClientSecret() {
    return this.httpClient.get('/src/assets/fakeData.json');
  }
}

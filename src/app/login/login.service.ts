import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

  constructor(private httpClient: HttpClient) {

  }

  /** 模擬取得 clientSecret 的 API */
  getClientSecret() {
    return this.httpClient.get('/src/assets/fakeData.json');
  }

  /** 取得 Access Token
   * ref：https://developers.line.biz/en/reference/line-login/#issue-access-token
   */
  getAccessToken(code: string, clientSecret: string) {

    const body = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: environment.redirectUri,
      client_id: environment.clientId_LINE_Login,
      client_secret: clientSecret
    };

    // 轉換資料格式
    const params = new URLSearchParams(Object.entries(body)).toString();

    return this.httpClient.post('https://api.line.me/oauth2/v2.1/token', params, { headers: this.headers });
  }

  /**  取得用戶資料
   * ref：https://developers.line.biz/en/docs/line-login/verify-id-token/
   */
  getProfileInfo(idToken: string) {

    const body = {
      id_token: idToken,
      client_id: environment.clientId_LINE_Login,
    };

    // 轉換資料格式
    const params = new URLSearchParams(Object.entries(body)).toString();
    return this.httpClient.post('https://api.line.me/oauth2/v2.1/verify', params, { headers: this.headers });
  }

  /** 登出 */
  logout(clientSecret: string) {
    const body = {
      access_token: sessionStorage.getItem('access_token')!,
      client_id: environment.clientId_LINE_Login,

      // 依照官方文件說明，WebApp 需要填入 client_secret
      // client_secret Required for channels whose App types is only Web app
      client_secret: clientSecret
    };

    // 轉換資料格式
    const params = new URLSearchParams(Object.entries(body)).toString();
    return this.httpClient.post('https://api.line.me/oauth2/v2.1/revoke', params, { headers: this.headers })
  }

}

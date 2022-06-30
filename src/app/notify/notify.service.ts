import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/** 發送訊息用的 service
 * ref:https://notify-bot.line.me/doc/en/
*/
export class NotifyService {

  private headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');


  constructor(private httpClient: HttpClient) { }

  // 模擬取得 clientSecret 的 API
  getClientSecret() {
    return this.httpClient.get('/assets/fakeData.json');
  }

  /** 取得授權碼 */
  getAuthCode() {
    const body = {
      response_type: 'code',
      client_id: environment.clientId_LINE_Notify,
      redirect_uri: environment.redirectUri + '/notify',
      scope: 'notify',
      state: '123'
    };

    const params = new URLSearchParams(Object.entries(body)).toString()
    return 'https://notify-bot.line.me/oauth/authorize?' + params;
  }

  /** 取得 accessToken */
  getAccessToken(code: string, clientSecret: string) {
    const body = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: environment.redirectUri + '/notify',
      client_id: environment.clientId_LINE_Notify,
      client_secret: clientSecret
    }

    const params = new URLSearchParams(Object.entries(body)).toString();
    return this.httpClient.post('/oauth/token', params, { headers: this.headers });
  }

  revokeAccessToken() {

    return this.httpClient.post('/api/revoke', null, {
      headers: {
        Authorization: `Bearer ${this.getNotifyAccessToken()}`,
      },
    })
  }

  /** 發送訊息
   * 發送之前須確認是否已取得 token
  */
  pushNotify(message: string) {
    const formData = new FormData();
    formData.append('message', message);

    return this.httpClient.post('/api/notify', formData, {
      headers: {
        Authorization: `Bearer ${this.getNotifyAccessToken()}`,
      },
    });
  }

  setNotifyAccessToken(token: string) {
    return localStorage.setItem('access_token_notify', token);
  }

  getNotifyAccessToken() {
    return localStorage.getItem('access_token_notify');
  }
}

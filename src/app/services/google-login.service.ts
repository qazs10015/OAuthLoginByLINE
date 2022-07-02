import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
/** Google Login */
export class GoogleLoginService {

  private headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')

  constructor(private httpClient: HttpClient) { }

  /** 取得授權碼
   * ref:https://developers.google.com/identity/protocols/oauth2/web-server#obtainingaccesstokens
   */
  getAuthCode() {
    const body = {
      response_type: 'code',
      client_id: environment.clientId_Google_Login,
      redirect_uri: environment.redirectUri + '/admin',
      scope: 'profile email openid',
      state: 'googleLogin',
      access_type: 'offline',
      include_granted_scopes: 'true'
    }

    const params = new URLSearchParams(Object.entries(body)).toString()
    return 'https://accounts.google.com/o/oauth2/v2/auth?' + params
  }

  /** 取得 Access Token
  * ref：https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code
  */
  getAccessToken(code: string, clientSecret: string) {

    const body = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: environment.redirectUri + '/admin',
      client_id: environment.clientId_Google_Login,
      client_secret: clientSecret
    }

    // 轉換資料格式
    const params = new URLSearchParams(Object.entries(body)).toString()

    return this.httpClient.post('https://oauth2.googleapis.com/token', params, { headers: this.headers, })
  }


  revokeAccessToken() {


    return this.httpClient.post('https://www.googleapis.com/auth/userinfo.profile', null, {
      headers: {
        Authorization: `Bearer ${this.getAccessTokenFromLocalStorage()}`,
      },
    })
  }

  /** 取得用戶的公開資訊
   * ref:
   * https://developers.google.com/identity/protocols/oauth2/scopes#oauth2
   * https://developers.google.com/identity/protocols/oauth2/web-server#callinganapi
   */
  getUserInfo() {

    return this.httpClient.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${this.getAccessTokenFromLocalStorage()}`,
      },
    })
  }

  /** 登出
   * ref：https://developers.google.com/identity/protocols/oauth2/web-server#tokenrevoke
   */
  logout() {
    const body = {
      token: this.getAccessTokenFromLocalStorage()!
    }

    // 轉換資料格式
    const params = new URLSearchParams(Object.entries(body)).toString()
    return this.httpClient.post('https://oauth2.googleapis.com/revoke', params, { headers: this.headers })
  }

  setGoogleAccessToken(token: string) {
    return localStorage.setItem('access_token_google', token);
  }

  getAccessTokenFromLocalStorage() {
    return localStorage.getItem('access_token_google');
  }

  setGoogleRefreshToken(token: string) {
    return localStorage.setItem('refresh_token_google', token);
  }

  getRefreshTokenFromLocalStorage() {
    return localStorage.getItem('refresh_token_google');
  }

  setGoogleIdToken(token: string) {
    return localStorage.setItem('id_token_google', token);
  }

  getIdTokenFromLocalStorage() {
    return localStorage.getItem('id_token_google');
  }
}

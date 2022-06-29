import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
import { NotifyService } from '../notify/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  // LINE 個人資料
  profileInfoObj: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private notifyService: NotifyService) { }

  async ngOnInit() {

    this.route.queryParamMap.subscribe(async queryParams => {
      const authCode = queryParams.get('code') ?? '';
      if (!!authCode) {
        const clientObj: any = await lastValueFrom(this.loginService.getClientSecret());
        const tokenObj: any = await lastValueFrom(this.loginService.getAccessToken(authCode, clientObj.clientSecret_Login));

        console.log(tokenObj);
        sessionStorage.setItem('access_token', tokenObj.access_token);
        sessionStorage.setItem('refresh_token', tokenObj.refresh_token);
        sessionStorage.setItem('id_token', tokenObj.id_token);

        this.profileInfoObj = await lastValueFrom(this.loginService.getProfileInfo(tokenObj.id_token));
        console.log(this.profileInfoObj);

      }

    });
  }

  /** 取得授權碼
   *  ref：https://developers.line.biz/en/docs/line-login/integrate-line-login/#making-an-authorization-request
   */
  lineLogin() {

    let url = new URL('https://access.line.me/oauth2/v2.1/authorize');

    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', environment.clientId_LINE_Login);
    url.searchParams.set('redirect_uri', 'http://localhost:4200/');
    url.searchParams.set('state', '123');
    url.searchParams.set('scope', 'profile openid email');

    window.location.href = url.toString();
  }

  /** 登出 */
  async lineLogout() {
    const clientObj: any = await lastValueFrom(this.loginService.getClientSecret());
    this.loginService.logout(clientObj.clientSecret_Login).subscribe(() => {
      // 清空資料
      this.profileInfoObj = null;
      // 清除路由
      this.router.navigateByUrl('');
    });
  }


}

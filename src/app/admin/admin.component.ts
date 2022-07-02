import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService, LoginType } from '../services/common.service';
import { GoogleLoginService } from '../services/google-login.service';
import { NotifyService } from '../services/notify.service';
import { LoginService } from '../services/login.service';
import { lastValueFrom, Observable } from 'rxjs';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  loginType: LoginType = LoginType.SYSTEM;


  // 個人資料
  profileInfoObj: any = null;

  @ViewChild('txtNotifyMsg') txtNotifyMsg!: ElementRef<HTMLTextAreaElement>;

  /** 是否顯示發送 LINE Notify 的畫面 */
  isShowPushNotifyView = false;


  myForm = new FormGroup({
    account: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private loginService: LoginService,
    private notifyService: NotifyService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private googleService: GoogleLoginService) { }

  async ngOnInit() {
    this.route.queryParamMap.subscribe(async queryParams => {
      const authCode = queryParams.get('code') ?? '';
      if (!!authCode) {
        const clientObj: any = await lastValueFrom(this.commonService.getClientSecret());

        const state = queryParams.get('state') ?? '';

        let getAccessToken$ = new Observable();

        switch (state) {
          case 'googleLogin':
            // 使用 Google Login 取得 AccessToken
            getAccessToken$ = this.googleService.getAccessToken(authCode, clientObj.clientSecret_Google_Login);
            // 設定登入類型
            this.loginType = LoginType.Google;
            break;

          default:

            break;
        }

        const tokenObj: any = await lastValueFrom(getAccessToken$);

        // 儲存 token 資料
        this.googleService.setGoogleAccessToken(tokenObj.access_token);
        this.googleService.setGoogleRefreshToken(tokenObj.access_token);
        this.googleService.setGoogleIdToken(tokenObj.access_token);

        // 顯示發送 LINE Notify 的畫面
        this.isShowPushNotifyView = true;


        this.profileInfoObj = await lastValueFrom(this.googleService.getUserInfo());

      }

    });
  }

  /** 模擬登入 帳號密碼為 123/123 */
  login() {
    this.loginType = LoginType.SYSTEM;
    // 驗證登入資訊
    if ((this.myForm.get('account')!.value === '123' && this.myForm.get('password')!.value === '123')) {
      this.isShowPushNotifyView = true;
    } else {
      alert('帳號密碼錯誤!!!');
    }

  }

  googleLogin() {
    window.location.href = this.googleService.getAuthCode();

  }

  /** 登出
   * 依據目前登入的類型執行對應的登出功能
   */
  logout(loginType: LoginType) {
    switch (loginType) {
      case LoginType.SYSTEM:
        this.myForm.reset();
        break;
      case LoginType.Google:
        this.googleService.logout().subscribe();
        // 清空個人資料
        this.profileInfoObj = null;
        break;
    }

    this.isShowPushNotifyView = false;
  }

  /** 發送訊息 */
  pushNotify() {
    this.notifyService.pushNotify(this.txtNotifyMsg.nativeElement.value).subscribe();
    alert(`訊息："${this.txtNotifyMsg.nativeElement.value}" 已發送!`);

  }



}

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NotifyService } from './notify.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {

  /** 是否已取得 AccessToken */
  get localAccessToken() {
    return this.notifyService.getNotifyAccessToken() || '';
  }

  constructor(private router: Router, private route: ActivatedRoute, private notifyService: NotifyService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(async queryParams => {
      const authCode = queryParams.get('code') ?? '';

      if (!!authCode) {
        const clientObj: any = await lastValueFrom(this.notifyService.getClientSecret());
        const tokenObj: any = await lastValueFrom(this.notifyService.getAccessToken(authCode, clientObj.clientSecret_Notify));

        this.notifyService.setNotifyAccessToken(tokenObj.access_token);

      }

    });
  }

  /** 取得授權碼 */
  getAuthCode() {
    window.location.href = this.notifyService.getAuthCode();
  }

  /** 發送訊息 */
  pushNotify() {
    this.notifyService.pushNotify('This is LINE notify homework').subscribe()
  }

  /** 移除 Token */
  revokeToken() {
    this.notifyService.revokeAccessToken().subscribe(() => {
      this.notifyService.setNotifyAccessToken('');
      // 清除路由
      this.router.navigateByUrl('/notify');
    });
  }
}

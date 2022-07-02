import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../notify/notify.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  @ViewChild('txtNotifyMsg') txtNotifyMsg!: ElementRef<HTMLTextAreaElement>;

  /** 是否顯示發送 LINE Notify 的畫面 */
  isShowPushNotifyView = false;


  myForm = new FormGroup({
    account: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private notifyService: NotifyService) { }

  ngOnInit(): void {
  }

  /** 模擬登入 帳號密碼為 123/123 */
  login() {
    // 驗證登入資訊
    this.isShowPushNotifyView = (this.myForm.get('account')!.value === '123' && this.myForm.get('password')!.value === '123');
  }

  logout(type: string) {
    switch (type) {
      case 'system':
        this.myForm.reset();
        break;
    }
  }

  /** 發送訊息 */
  pushNotify() {
    this.notifyService.pushNotify(this.txtNotifyMsg.nativeElement.value).subscribe();
    alert(`訊息："${this.txtNotifyMsg.nativeElement.value}" 已發送!`);

  }



}

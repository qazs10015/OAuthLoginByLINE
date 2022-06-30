## 實作 LINE Login、LINE Notify

[Demo](https://qazs10015.github.io/OAuthLoginByLINE/)

[LINE Login Document](https://developers.line.biz/en/reference/line-login/#issue-access-token)

[LINE Notify Document](https://notify-bot.line.me/doc/en/)

本專案使用 Angular 實作 LINE Login、LINE Notify 兩種功能

## LINE Login

### LINE Develop Console

  開發前需到 [LINE Developer Console](https://developers.line.biz/console/) 建立 Channel

  ![image](https://user-images.githubusercontent.com/30744341/176721751-ba4288f6-28b5-409a-8a24-b98114945d81.png)

  會需要填寫一些基本資訊，比較需要注意的是 `App Types`會有不同

* Web app：`response_type` 會使用 `code` 的方式
* Mobile app：`response_type` 會使用 `token` 的方式
  
  ![image](https://user-images.githubusercontent.com/30744341/176722440-fad62794-3504-48cc-810c-d0c283b7fab7.png)

  ![image](https://user-images.githubusercontent.com/30744341/176723295-03161264-bd82-4bda-b1fe-f7549fea3b75.png)

  建立完成後就可以取得需要的資訊了，譬如 `Channel ID`、`Channel secret`

  注意：以 OAuth 的角度 `Channel ID` 就是 `Client ID`，`Channel secret` 就是 `Client Secret`

### 取得 Email 資訊

  如果需要用戶提供 email 就需要在同一個畫面設定 `OpenID Connect`，填完基本資料後就完成了

  ![image](https://user-images.githubusercontent.com/30744341/176724964-a308d656-cc8c-44e5-b6a9-62d77d04b8ba.png)

### 設定 callBack Url

  基本設定完成後需要再設定 callBack URL，這個步驟會在取得授權後自動導頁到 callBack URL

  ![image](https://user-images.githubusercontent.com/30744341/176728415-f00c9a77-43f5-4c56-8450-482a02dee3dd.png)
  
### 實際應用

  LINE Login 基本應用可以看 [`login.service.ts`](https://github.com/qazs10015/OAuthLoginByLINE/blob/master/src/app/login/login.service.ts)，內容包含

  1. 取得授權碼(authorize code)
  2. 取得 AccessToken
  3. 取得用戶資料(name、email、picture)
  4. 移除 AccessToken

## LINE Notify

### LINE Notify Service

  開發前需到 [LINE Notify Service](https://notify-bot.line.me/my/services/) 建立 Service

  建立完成後就可以取得需要的資訊了，譬如 `Client ID`、`Client Secret`

  ![image](https://user-images.githubusercontent.com/30744341/176727860-7cf14d78-4eea-4880-8bcd-1980836bc93f.png)

  ### 設定 callBack Url

  基本設定完成後需要再設定 callBack URL，這個步驟會在取得授權後自動導頁到 callBack URL

  ![image](https://user-images.githubusercontent.com/30744341/176726887-185a1d23-ba4a-4aaa-a372-fe80d9e37911.png)

### 實際應用

  LINE Notify 基本應用可以看 [`notify.service.ts`](https://github.com/qazs10015/OAuthLoginByLINE/blob/master/src/app/notify/notify.service.ts)，內容包含

  1. 取得授權碼(authorize code)
  2. 取得 AccessToken
  3. 發送訊息
  4. 移除 AccessToken

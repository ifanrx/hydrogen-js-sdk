import {expectType} from 'tsd'

wx.BaaS.auth.loginWithWechat()
wx.BaaS.auth.loginWithWechat(null)
wx.BaaS.auth.loginWithWechat(null, {})
wx.BaaS.auth.loginWithWechat(null, {syncUserProfile: false})
wx.BaaS.auth.loginWithWechat(null, {syncUserProfile: false, createUser: true})
wx.BaaS.auth.loginWithWechat({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}})
wx.BaaS.auth.loginWithWechat({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}}, {})
wx.BaaS.auth.loginWithWechat({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}}, {syncUserProfile: false})
wx.BaaS.auth.loginWithWechat({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}}, {syncUserProfile: false, createUser: true})
wx.BaaS.auth.loginWithWechat().then(user => expectType<WechatBaaS.CurrentUser>(user))

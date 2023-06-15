addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  // 填入自己的信息
  const APPID = '';
  const APPSECRET = '';
  
  //模板ID
  const MODULEID = '';
  //用户ID
  const OPENID = '';
  const ISLOG = true;
  
  function _log(s) {
    if (ISLOG) {
      console.log(`[LOG] ${s}`);
    }
  }
  
  async function getAccessToken() {
    _log('Waiting for getAccessToken()');
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
    const response = await fetch(url, { cf: { cacheTtl: 60 } }); // 设置缓存时间为60秒
    const tokenData = await response.json();
    const token = tokenData.access_token;
    return token;
  }
  
  async function sendMessage(phoneNumberV, messageContentV, receiverNumberV,timestampV,clientV,accessToken) {
    _log("Waiting for sendMessage(), ${phoneNumberV}, ${messageContentV}, ${receiverNumberV},${timestampV},${clientV}");
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;
    const jsonStr = JSON.stringify({
      touser: OPENID,
      template_id: MODULEID,
      url: '',
      topcolor: '#FF0000',
      data: {
        phoneNumber: {
          value: phoneNumberV
        },
        messageContent: {
          value: messageContentV
        },
        receiverNumber: {
          value: receiverNumberV
        },
        timestamp: {
          value: timestampV
        },
        client: {
          value: clientV
        }
      }
    });
  
    const response = await fetch(url, {
      method: 'POST',
      body: jsonStr,
      headers: { 'Content-Type': 'application/json' }
    });
  
    const responseData = await response.json();
    if (responseData.errmsg === 'ok') {
      _log('Push Success');
    } else {
      _log(response.text);
    }
  
    return responseData.errmsg;
  }
  
  async function handleRequest(request) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }
  
    try {
      const data = await request.json()
      const msg = data.msg || ''
      _log(msg)
      const lines = msg.split("\n");
      const phoneNumber = lines[0];
      const messageContent = lines[1];
      const receiverNumber = lines[2];
      const timestamp = lines[4];
      const client = lines[5];
  
      const accessToken = await getAccessToken();
      await sendMessage(phoneNumber, messageContent, receiverNumber,timestamp,client,accessToken);
  
      return new Response('Message Sent:' + msg, { status: 200 })
    } catch (error) {
      return new Response('Invalid JSON', { status: 400 })
    }
  }
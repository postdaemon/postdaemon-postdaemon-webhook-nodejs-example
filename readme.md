## PostDaemon Webhook Node.JS Example
If your domain has secure webhooks enabled please populate your postdaemonWebhookKey either through environment variable and or secret.

## To learn more about our webhook functionality
https://postdaemon.com/docs

Logging /wh example, checking signature
```
smtp.message_delivery
example.postdaemonsandbox.com
[Object: null prototype] {
  id: '2023430424.rzUyCxqwovMuYtlsPrEqPpfognYmGlfkMjNi9h1gDfWeMdHcGbZaEZVYXX3W4VNU2TSS0RDQPP1OIN9M9L0KEJ3I0H2GEF3E9D3C9B3A297827363504130211qzVyDx@example.postdaemon.net',
  subject: 'Fw: testing pdf',
  from: 'Alex <diagraph@example.com>',
  to: 'Test <test@example.postdaemonsandbox.com>',
  returnPath: '',
  replyTo: 'In- <715920114.1954081.1682826671020@mail.example.com>',
  cc: '',
  bcc: '',
  date: 'Sun, 30 Apr 2023 00:02:00 -0400 (EDT)',
  status: 'Accepted',
  statusDescription: 'PostDaemon accepted this inbound message on behalf of testuit',
  outbound: 'false',
  sendingIp: '66.163.184.148',
  eml: 'example.postdaemonsandbox.com/example/eml/inbound/2023430424.rzUyCxqwovMuYtlsPrEqPpfognYmGlfkMjNi9h1gDfWeMdHcGbZaEZVYXX3W4VNU2TSS0RDQPP1OIN9M9L0KEJ3I0H2GEF3E9D3C9B3A297827363504130211qzVyDx@example.postdaemon.net.eml',
  text: 'Hello world'
}
{
  fieldname: 'attachments',
  originalname: 'test.pdf',
  encoding: '7bit',
  mimetype: 'application/octet-stream',
  buffer: <xxxxx>,
  size: 14
}
Content-Type: multipart/form-data; boundary=66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Event-Type: smtp.message_delivery
Domain: example.postdaemonsandbox.com
PostDaemon-Signature: 
Content-Length: 2844
Origin: example.postdaemon.net


--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="attachments"; filename="test.pdf"
Content-Type: application/octet-stream


--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="id"

2023430424.rzUyCxqwovMuYtlsPrEqPpfognYmGlfkMjNi9h1gDfWeMdHcGbZaEZVYXX3W4VNU2TSS0RDQPP1OIN9M9L0KEJ3I0H2GEF3E9D3C9B3A297827363504130211qzVyDx@example.postdaemon.net
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="subject"

Fw: testing pdf
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="from"

Alex <diagraph@example.com>
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="to"

Testuit Info <test@example.postdaemonsandbox.com>
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="returnPath"


--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="replyTo"

In- <715920114.1954081.1682826671020@mail.example.com>
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="cc"


--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="bcc"


--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="date"

Sun, 30 Apr 2023 00:02:00 -0400 (EDT)
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="status"

Accepted
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="statusDescription"

PostDaemon accepted this inbound message on behalf of example
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="outbound"

false
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="sendingIp"

66.163.184.148
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="eml"

example.postdaemonsandbox.dev/testuit/eml/inbound/2023430424.rzUyCxqwovMuYtlsPrEqPpfognYmGlfkMjNi9h1gDfWeMdHcGbZaEZVYXX3W4VNU2TSS0RDQPP1OIN9M9L0KEJ3I0H2GEF3E9D3C9B3A297827363504130211qzVyDx@example.postdaemon.net.eml
--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d
Content-Disposition: form-data; name="text"

Hello world

--66e97d07be73e958a629d68dcef0a9e0b323ab73470e8b6f62b446036f9d--

SIGNATURE VALID:true
```
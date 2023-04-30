
/*
        PostDaemon webhook route node.js example implementation
        Author: Alex Padula
*/

import express from "express"
import crypto from "crypto"
import multer from "multer"

const app = express()
const port = 3000
const upload = multer()

const postdaemonWebhookKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDae0nb+SINvHzZSV+a4Rh+VytH39qqe3nvZK9HkHzuN2cRxJBhFxrJF/S0gizJ2tRB5p8xQxR8YLIqeF9CwjuQmvUEd7pkSM+xJnKhA/S+WcLFopsQzC8ezt+7XMrITKdqoW7yTmQ/1ycWnKRby+qlFlrvQF51r+J2L0M8TI4vSwIDAQAB"

app.use(express.urlencoded({ extended: true }))
app.use(upload.array("attachments")) // PostDaemon post files to attacments

app.post('/wh', (req, res) => {
    let body = req.body // multipart request body
    let eventType = req.header("Event-Type")  // event type 
    let domain = req.header("Domain") // mail domain
    let signature = req.header("PostDaemon-Signature") // will not be supplied if domain is not using a secure webhook
    let contentType = req.header("Content-Type")

    switch(eventType) {
        case "smtp.message_delivery": // inbound and outbound mail event
            let attachments = req.files // mail attachments


            if (signature && !postdaemonWebhookKey) {
                console.error("Please setup your webhook key..  Your domain is secure.  If you do not want a secure webhook, deactive secure webhooks for " + domain + " through REST or your dashboard.")
        
                res.status(200) // *
                return
            }
        
            const regexBoundary = /boundary=(.*)/
            let boundary = contentType.match(regexBoundary).join(",").split("boundary=")[1].split(",")[0]
            if(signature) {
                // decode signature
                let decodedSig =  Buffer.from(req.header("PostDaemon-Signature"), 'base64')
                let decodedPubKey =  Buffer.from(postdaemonWebhookKey,'base64').toString('base64')
                let key = crypto.createPublicKey({
                         key: `
-----BEGIN PUBLIC KEY-----
${decodedPubKey}
-----END PUBLIC KEY-----
        `,
                         format: 'pem'
                 })
        
        
                // Format PostDaemon Webhook Signature
                let preSig = ""
                preSig += `Content-Type: ${contentType}\r\n`
                preSig += `Event-Type: ${eventType}\r\n`
                preSig += `Domain: ${domain}\r\n`
                preSig += "PostDaemon-Signature: \r\n"
                preSig += `Content-Length: ${req.header("Content-Length")}\r\n`
                preSig += `Origin: ${req.headers.origin}\r\n\r\n\r\n`
        
                if(attachments.length) {
                  attachments.map(function(a) {
                    preSig += "--" + boundary + "\r\n"
                    preSig += `Content-Disposition: form-data; name="attachments"; filename="${a.originalname}"\r\n`
                    preSig += `Content-Type: ${a.mimetype}\r\n\r\n`
                    preSig += a.buffer.toString() + "\r\n"  
                })
                }
        
        
                // Id 
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="id"\r\n\r\n`
                preSig += body.id + "\r\n"
        
                // Subject
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="subject"\r\n\r\n`
                preSig += body.subject + "\r\n"
        
                // From
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="from"\r\n\r\n`
                preSig += body.from + "\r\n"
        
                // To
                // If an array of to's place each address in own block
                if(Array.isArray(body.to)) {
                        body.to.map((t) => {
                            preSig += "--" + boundary + "\r\n"
                            preSig += `Content-Disposition: form-data; name="to"\r\n\r\n`
                            preSig += t + "\r\n"
                        })
                } else {
                        preSig += "--" + boundary + "\r\n"
                        preSig += `Content-Disposition: form-data; name="to"\r\n\r\n`
                        preSig += req.body.to + "\r\n"
                }

                // Receiver (With multiple to's the receiver field informs of which receiver the event correlates to)
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="receiver"\r\n\r\n`
                preSig += body.receiver + "\r\n"
        
                // Return path
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="returnPath"\r\n\r\n`
                preSig += body.returnPath + "\r\n"
        
                // Reply to
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="replyTo"\r\n\r\n`
                preSig += body.replyTo + "\r\n"
                        
                // Cc
                // If an array of cc's place each address in own block
                if(Array.isArray(body.cc)) {
                    body.to.map((cc) => {
                        preSig += "--" + boundary + "\r\n"
                        preSig += `Content-Disposition: form-data; name="cc"\r\n\r\n`
                        preSig += cc + "\r\n"
                    })
                } else {
                        preSig += "--" + boundary + "\r\n"
                        preSig += `Content-Disposition: form-data; name="cc"\r\n\r\n`
                        preSig += req.body.cc + "\r\n"
                }
    
        
                // Bcc
                // If an array of bcc's place each address in own block
                if(Array.isArray(body.bcc)) {
                    body.to.map((bcc) => {
                        preSig += "--" + boundary + "\r\n"
                        preSig += `Content-Disposition: form-data; name="bcc"\r\n\r\n`
                        preSig += bcc + "\r\n"
                    })
                } else {
                        preSig += "--" + boundary + "\r\n"
                        preSig += `Content-Disposition: form-data; name="bcc"\r\n\r\n`
                        preSig += req.body.bcc + "\r\n"
                }
        
                // Date
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="date"\r\n\r\n`
                preSig += body.date + "\r\n"
        
                // Status
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="status"\r\n\r\n`
                preSig += body.status + "\r\n"
        
                // Status description
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="statusDescription"\r\n\r\n`
                preSig += body.statusDescription + "\r\n"
        
                // Outbound
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="outbound"\r\n\r\n`
                preSig += body.outbound + "\r\n"
        
                // Sending IP
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="sendingIp"\r\n\r\n`
                preSig += body.sendingIp + "\r\n"
        
                // Eml
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="eml"\r\n\r\n`
                preSig += body.eml + "\r\n"
        
                // Text
                preSig += "--" + boundary + "\r\n"
                preSig += `Content-Disposition: form-data; name="text"\r\n\r\n`
                preSig += body.text + "\r\n"
                preSig += "--" + boundary + "--\r\n"
        
                // Complete lets log
                console.log(preSig)
        
                // Check signature
                let isValid = crypto.verify(crypto.RSASSA_PKCS1_SHA256, preSig, key, decodedSig)
        
                console.log("SIGNATURE VALID:" + isValid)
                break
            }
            case "smtp.unsubscribe":
                // tmi
                break
            default:
                console.log("Invalid event.")
    }
   

        res.sendStatus(200) // *
})

app.listen(port, () => {
            console.log(`PostDaemon Webhook Node.JS Example listening on port ${port}`)
    })


/*
        PostDaemon webhook route node.js example implementation
        Author: Alex Padula
*/

import express from "express"
import crypto from "crypto"
import { exit } from "process"
import multer from "multer"

const app = express()
const port = 3000
const upload = multer()

const postdaemonWebhookKey = ""

app.use(express.urlencoded({ extended: true }))
app.use(upload.array("attachments")); 

app.post('/wh', (req, res) => {
    let body = req.body
    let eventType = req.header("Event-Type")  // event type 
    let domain = req.header("Domain") // mail domain
    let signature = req.header("PostDaemon-Signature") // will not be supplied if domain is not using a secure webhook
    let contentType = req.header("Content-Type")
    let attachments = req.files

    console.log(eventType) // event type 
    console.log(domain) // mail domain
    console.log(body)

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

        let preSig = ""
        preSig += `Content-Type: ${contentType}\n`
        preSig += `Event-Type: ${eventType}\n`
        preSig += `Domain: ${domain}\n`
        preSig += "PostDaemon-Signature: \n"
        preSig += `Content-Length: ${req.header("Content-Length")}\n`
        preSig += `Origin: ${req.headers.origin}\n\n\n`

        if(attachments.length) {
          attachments.map(function(a) {
            console.log(a)
            preSig += "--" + boundary + "\n"
            preSig += `Content-Disposition: form-data; name="attachments"; filename="${a.originalname}"\n`
            preSig += `Content-Type: ${a.mimetype}\n\n\n` 
        })
        }


        // Id 
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="id"\n\n`
        preSig += req.body.id + "\n"

        // Subject
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="subject"\n\n`
        preSig += req.body.subject + "\n"

        // From
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="from"\n\n`
        preSig += req.body.from + "\n"

        // To
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="to"\n\n`
        preSig += req.body.to + "\n"

        // Return path
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="returnPath"\n\n`
        preSig += req.body.returnPath + "\n"

        // Reply to
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="replyTo"\n\n`
        preSig += req.body.replyTo + "\n"

        // Cc
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="cc"\n\n`
        preSig += req.body.cc + "\n"

        // Bcc
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="bcc"\n\n`
        preSig += req.body.bcc + "\n"

        // Date
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="date"\n\n`
        preSig += req.body.date + "\n"

        // Status
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="status"\n\n`
        preSig += req.body.status + "\n"

        // Status description
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="statusDescription"\n\n`
        preSig += req.body.statusDescription + "\n"

        // Outbound
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="outbound"\n\n`
        preSig += req.body.outbound + "\n"

        // Sending IP
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="sendingIp"\n\n`
        preSig += req.body.sendingIp + "\n"

        // Eml
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="eml"\n\n`
        preSig += req.body.eml + "\n"

        // Text
        preSig += "--" + boundary + "\n"
        preSig += `Content-Disposition: form-data; name="text"\n\n`
        preSig += req.body.text + "\n"
        preSig += "--" + boundary + "--\n"

        console.log(preSig)

        let isValid = crypto.verify(crypto.RSASSA_PKCS1_SHA256, preSig, key, decodedSig)
        console.log("SIGNATURE VALID:" + isValid)

    }

        res.status(200) // *
})

app.listen(port, () => {
            console.log(`PostDaemon Webhook Node.JS Example listening on port ${port}`)
    })
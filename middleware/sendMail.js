  import nodemailer from 'nodemailer';

      const transporter = nodemailer.createTransport({
            service: 'gmail',
          auth: {
              user: 'invoice1256@gmail.com',
              pass: 'mhja reen xqkc rxdh'
          }
      });

      const mailOptions = {
          from:'invoice1256@gmail.com',
          to: 'ronideni1220@gmail.com',
          subject: 'Testing',
          text: 'Hello from nodemailer',
      };

      await transporter.sendMail(mailOptions);


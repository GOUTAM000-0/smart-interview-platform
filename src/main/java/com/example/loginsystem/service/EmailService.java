package com.example.loginsystem.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final Resend resend;

    @Value("${resend.from-email}")
    private String fromEmail;

    public EmailService(
            @Value("${resend.api-key}") String apiKey
    ) {
        this.resend = new Resend(apiKey);
    }

    public void sendEmail(
            String toEmail,
            String subject,
            String body
    ) {

        try {

            CreateEmailOptions emailOptions =
                    CreateEmailOptions.builder()
                            .from(fromEmail)
                            .to(toEmail)
                            .subject(subject)
                            .html(body)
                            .build();

            CreateEmailResponse response =
                    resend.emails().send(emailOptions);

            System.out.println(
                    "✅ Email sent successfully. Resend ID: "
                            + response.getId()
            );

        } catch (ResendException e) {

            System.err.println(
                    "❌ Failed to send email through Resend: "
                            + e.getMessage()
            );

            throw new RuntimeException(
                    "Failed to send email",
                    e
            );
        }
    }
}



//package com.example.loginsystem.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    public void sendEmail(String toEmail, String subject, String body) {
//
//        SimpleMailMessage message = new SimpleMailMessage();
//
//        message.setTo(toEmail);
//        message.setSubject(subject);
//        message.setText(body);
//
//        mailSender.send(message);
//    }
//}
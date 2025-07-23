package com.hicode.backend.service;

import com.hicode.backend.model.entity.DonationProcess;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    private final TemplateEngine templateEngine;

    public PdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateCertificatePdf(DonationProcess donationProcess) {
        // Định dạng ngày tháng
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String donationDate = donationProcess.getDonationAppointment() != null ?
                donationProcess.getDonationAppointment().getAppointmentDate().format(dateFormatter) : "N/A";

        // Chuẩn bị dữ liệu cho templates
        Context context = new Context();
        context.setVariable("donorName", donationProcess.getDonor().getFullName());
        context.setVariable("donationDate", donationDate);
        context.setVariable("bloodType", donationProcess.getDonor().getBloodType().getBloodGroup());
        context.setVariable("volume", donationProcess.getCollectedVolumeMl());
        context.setVariable("processId", donationProcess.getId());

        // Tạo HTML từ templates Thymeleaf
        String htmlContent = templateEngine.process("certificate_template", context);

        // Chuyển HTML thành PDF
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        HtmlConverter.convertToPdf(htmlContent, new PdfWriter(outputStream));

        return outputStream.toByteArray();
    }
}
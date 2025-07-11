package com.iaan.kepco.controller;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;

public class ImageGenerator {

    public static void main(String[] args) {
        // 이미지 크기 설정
        int width = 800;
        int height = 600;

        // BufferedImage 객체 생성 (빈 이미지 생성)
        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        // Graphics2D 객체로 이미지 그리기
        Graphics2D g2d = bufferedImage.createGraphics();

        // 배경색 설정 (흰색)
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, width, height);

        // 텍스트 색상 및 폰트 설정
        g2d.setColor(Color.BLACK);
        g2d.setFont(new Font("Arial", Font.BOLD, 50));

        // 텍스트 그리기
        String text = "Hello, World!";
        int textX = 100;
        int textY = 100;
        g2d.drawString(text, textX, textY);

        // 원 그리기
        g2d.setColor(Color.RED);
        int circleX = 200;
        int circleY = 200;
        int circleDiameter = 100;
        g2d.fillOval(circleX, circleY, circleDiameter, circleDiameter);

        // 그리기 작업 종료
        g2d.dispose();

        // 파일로 이미지 저장
        try {
            File outputFile = new File("generated_image.png");
            ImageIO.write(bufferedImage, "png", outputFile);
            System.out.println("이미지가 생성되었습니다: " + outputFile.getAbsolutePath());
        } catch (Exception e) {
            System.out.println("이미지 생성 중 오류가 발생했습니다.");
            e.printStackTrace();
        }
    }
}
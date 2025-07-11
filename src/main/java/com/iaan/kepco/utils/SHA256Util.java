package com.iaan.kepco.utils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class SHA256Util {
	/**
	 * @author orange
	 * @category 일반적인 SHA-256 암호화를 한다.
	 * */
	public String encrypt(String txt) throws NoSuchAlgorithmException {
	    //1. Digest 인스턴스 생성
	    MessageDigest mDigest = MessageDigest.getInstance("SHA-256");
	    mDigest.reset();
	    
	    //2. byte로 변환된 텍스트 바인딩
	    mDigest.update(txt.getBytes(StandardCharsets.UTF_8));
	     
	    //3. hash값으로 변환된 byte array 리턴 (SHA-xxx으로 해싱)
	    byte[] msgStr = mDigest.digest() ;
	    
	    return this.bytesToHex(msgStr);
	}
	
	/**
	 * @author orange
	 * @category SALT가 추가된 SHA-256 암호화를 한다.
	 * */
	public String encrypt(String pw, String salt) throws NoSuchAlgorithmException {
	    //1. Digest 인스턴스 생성
	    MessageDigest mDigest = MessageDigest.getInstance("SHA-256");
	    mDigest.reset();
	    
	    //2. byte로 변환된 텍스트 바인딩
	    mDigest.update(salt.getBytes(StandardCharsets.UTF_8));
	     
	    //3. hash값으로 변환된 byte array 리턴 (SHA-xxx으로 해싱)
	    byte[] msgStr = mDigest.digest(pw.getBytes(StandardCharsets.UTF_8));
	    
	    return this.bytesToHex(msgStr);
	}
	
	/**
	 * @author orange
	 * @category SALT가 추가되고, 키 스트레칭을 사용한 SHA-256 암호화를 한다.
	 * @apiNote 키 스트레칭(key stretching)란 반복해서 암호화하는것을 말한다. 
	 * */
	public String encrypt(String pw, String salt, int KeyStretching) throws NoSuchAlgorithmException {
	    // 1. Digest 인스턴스 생성
	    MessageDigest mDigest = MessageDigest.getInstance("SHA-256");
	    mDigest.reset();
	    
	    // 2. byte로 변환된 텍스트 바인딩
	    mDigest.update(salt.getBytes(StandardCharsets.UTF_8));
	     
	    // 3. hash값으로 변환된 byte array 리턴 (SHA-xxx으로 해싱)
	    byte[] msgStr = mDigest.digest(pw.getBytes(StandardCharsets.UTF_8));
	    
	    // 4. KeyStretching만큼 키 스트레칭을 한다.
	    for (int index = 0; index < KeyStretching; index++) {
	    	mDigest.reset();
	    	msgStr = mDigest.digest(msgStr);
	    }
	    
	    return this.bytesToHex(msgStr);
	}
	
	/**
	 * @author orange
	 * @category byte를 16진수로 변경
	 * */
	private String bytesToHex(byte[] bytes) {
	    StringBuffer sbuf = new StringBuffer();
	    
	     // 해시된 데이터는 바이트 배열의 바이너리 데이터이므로 16진수 문자열로 변환
	    for(int i=0; i < bytes.length; i++){
	        byte byteData = bytes[i];
	        // byteData를 HexString(16진수)으로 변환
	        // Integer.toString(int값,  16) 메소드를 통해서 정수값을 16진수로 변환하는 것은 소스코드를 보고도 명확히 알 수 있다.
	        String tmpEncTxt = Integer.toString((byteData & 0xff) + 0x100, 16).substring(1);
	         
	        sbuf.append(tmpEncTxt) ;
	    }
	    return sbuf.toString();
	}
	
	/**
	 * @author orange
	 * @category salt 생성 (랜덤문자열생성)
	 * */
	public static String getSalt() throws NoSuchAlgorithmException {
		SecureRandom random = SecureRandom.getInstance("SHA1PRNG");

		byte[] salt = new byte[10];
		random.nextBytes(salt);
		
		StringBuffer sb = new StringBuffer();
		for(int i = 0; i < salt.length; i++) {
			sb.append(String.format("%02x", salt[i]));
		}
		
		return sb.toString();
	}

}

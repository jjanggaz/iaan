package com.iaan.kepco.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.StringWriter;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Scanner;
import java.util.zip.GZIPInputStream;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.CipherOutputStream;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.ContentDisposition.Builder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public class FileUtil {
	public static void fileUpload(String dir, MultipartFile mfile, String fileName)
			throws NoSuchFileException, FileAlreadyExistsException, IOException {
		String fullPath = FileUtil.getFullPath(dir, fileName);
		File path = new File(dir);
		if(!path.isDirectory()) {
			path.mkdirs();
		}
		File file = new File(fullPath);
		mfile.transferTo(file);
	}

	public static void fileUpload2(String dir, MultipartFile mfile) throws NoSuchFileException, FileAlreadyExistsException, IOException {
		String fullPath = FileUtil.getFullPath(dir, mfile.getOriginalFilename());
		File path = new File(dir);
		if(!path.isDirectory()) {
			path.mkdirs();
		}
		File file = new File(fullPath);
		mfile.transferTo(file);
	}


	

	public static String getReadFile(String path,String fileNm) throws Exception {

		// 파일 입력스트림 생성
		FileReader fileReader = new FileReader(path+fileNm);
		// 입력 버퍼 생성
		BufferedReader bufferedReader = new BufferedReader(fileReader);

		// 읽기 수행
		String line = "";
		String result = "";
		int cnt = 0;
		while( (line = bufferedReader.readLine()) != null ){ // 파일 내 문자열을 1줄씩 읽기 while
			//if( line.contaions("찾을 문자열") ){ // 찾고자하는 문자열이 있을 때 작성
		    result += line + "\n"; // 한줄씩 읽어 결과에 추가
		     cnt++; // 찾을 문자열이 몇개 포함되었는지 체크
		    //}
		}
		return result;

	}
	
	
	
	
	/**
	 * @author orange
	 * @category 파일이름에 파일확장자가 들어있는 일반 다운로드
	 * */
	public static ResponseEntity<?> fileDownload(String dir, String fileNm) throws NoSuchFileException, IOException {
		return FileUtil.fileDownload(dir, fileNm, fileNm);
	}
	
	/**
	 * @author orange
	 * @category Mime type에 따라서 화면에 보여줄지 다운로드할지 브라우저가 결정한다.
	 * @apiNote 현재까지 확인된 사항은 Mime type이 text/html이거나 text/xml이면 화면에 보여주고 그외에 파일이면 다운로드한다.
	 * */
	public static ResponseEntity<?> fileDownloadByInline(String dir, String originalFileNm, String timestampFileNm) 
			throws NoSuchFileException, IOException{
		return FileUtil.getResponseEntity(dir, originalFileNm, timestampFileNm, ContentDisposition.inline());
	}
	
	/**
	 * @author orange
	 * @category 파일다운로드 ( ContentDisposition.attachment )
	 * @param dir 경로
	 * @param originalFileNm 타임스탬프 변환 전 파일명
	 * @param timestampFileNm 실제저장된 타임스탬프 바이너리 파일명
	 * */
	public static ResponseEntity<?> fileDownload(String dir, String originalFileNm, String timestampFileNm) 
			throws NoSuchFileException, IOException {
		
		System.out.println("담은  dir  >>> " + dir);
		System.out.println("담은 exp3 originalFileNm >>> " + originalFileNm);
		System.out.println("담은 fileNm timestampFileNm >>> " + timestampFileNm);
		
		return FileUtil.getResponseEntity(dir, originalFileNm, timestampFileNm, ContentDisposition.attachment());
	}
	
	public static ResponseEntity<?> getResponseEntity(String dir, String originalFileNm, String timestampFileNm, Builder contentDisposition)
			throws NoSuchFileException, IOException {
		Path path = FileUtil.getPath(dir, timestampFileNm);
		
		System.out.println("담은  dir  >>> " + dir);
		System.out.println("담은  exp3 >>> " + originalFileNm);
		System.out.println("담은 timestampFileNm  >>> " + timestampFileNm);
		System.out.println("담은 path  >>> " + path);
		
		long sizes = Files.size(path);
		return ResponseEntity.ok()
				.headers(
						FileUtil.getHttpHeaders(
								contentDisposition
								, originalFileNm
								, sizes
								, FileUtil.getContentType(dir, originalFileNm)
							)
					)
				.body(new InputStreamResource(Files.newInputStream(path))); 
	}
	
	/**
	 * @author orange
	 * @category header 정보를 반환한다.
	 * @param fileNm 확장자가 포함된 파일명 ( 확장자이름으로 mime type을 조회한다. 실제 파일이 존재하지 않아도 상관없다. )
	 * */
	public static HttpHeaders getHttpHeaders(Builder contentDisposition, String fileNm, long contentLength, String contentType) {
		HttpHeaders headers = new HttpHeaders();
		headers
			.setContentDisposition(
					contentDisposition
						.name(fileNm) // API를 사용하는 client에서 요청한 사항 ( 파일이름이 필요하다고 함 )
						.filename(fileNm, StandardCharsets.UTF_8) // 브라우저가 다운로드할때 사용하는 파일이름
						.build()
				);
		headers
			.setContentLength(contentLength);
		headers
			.add(HttpHeaders.CONTENT_TYPE, contentType);
		return headers;
	}
	
	/**
	 * @author orange
	 * @category 경로와 파일이름을 인자로 받으면, java.nio.file.Path를 반환한다.
	 * */
	public static Path getPath(String path, String fileNm) {
		return Paths.get(FileUtil.getFullPath(path, fileNm));
	}
	
	/**
	 * @author orange
	 * @throws IOException 
	 * @category mimeType 조회
	 * @apiNote 파일 확장자명으로 mime type을 조회시 확장자가 없거나 알 수 없으면 octet-stream으로 반환한다.
	 * @apiNote 실제 파일이 없어도 파일 확장자명으로 content type을 조회 할 수 있다.
	 * */
	public static String getContentType(String path, String fileNm) throws IOException {
		String mimeType = Files.probeContentType(FileUtil.getPath(path, fileNm));
		return mimeType != null ? mimeType :  MediaType.APPLICATION_OCTET_STREAM_VALUE;
	}
	
	/**
	 * @author orange
	 * @category 경로와 파일이름을 인자로 받고, 전체 경로를 반환한다. ( 구분자를 일관성있게 사용하기 위함 )
	 * @param path 파일경로
	 * @param fileNm 파일이름이거나 경로가 쓰여도 상관없다.
	 * @apiNote 구분자를 File.separator를 사용할것인가 / 슬래시를 사용할것인가를 정하는 함수
	 * */
	//public static String getFullPath(String path, String fileNm) {
	//	return String.format("%s%s%s", path, "/", fileNm);
	//}
	
	
	public static String getFullPath(String path, String fileNm) {

		String restrictChars = "|\\\\?*<\":>/";
	    String regExpr = "[" + restrictChars + "]+";
	    // 파일명으로 사용 불가능한 특수문자 제거
	    String tmpStr = fileNm.replaceAll(regExpr, "");
	    // 공백문자 "_"로 치환
	    tmpStr =  tmpStr.replaceAll("[ ]", "_");

		return String.format("%s%s%s", path, File.separator, tmpStr);
	}
	
	/**
	 * @author orange
	 * @category 파일읽기
	 * */
	public static String read(String fullPath) throws IOException {
		try(FileInputStream fis = new FileInputStream(fullPath);
				BufferedInputStream bis = new BufferedInputStream(fis);){
			StringBuffer sb = new StringBuffer();
    		byte[] readBuffer = new byte[2048];
    		int i;
            while ((i = bis.read(readBuffer)) != -1) {
                // 1바이트씩 읽어들인 내용을 복사될 파일에 추가한다.
            	sb.append(new String(readBuffer, 0, i));
            }
            return sb.toString();
		}
	}
	
	/**
	 * @author orange
	 * @category 원본데이터 암호화
	 * */
	public static String encryptData(String fullPath, Cipher cipher) throws IOException {
		try(FileInputStream fis = new FileInputStream(fullPath);
				CipherInputStream cis = new CipherInputStream(fis, cipher);
					BufferedInputStream bis = new BufferedInputStream(cis);){
			StringBuffer sb = new StringBuffer();
			byte[] readBuffer = new byte[2048];
    		int i;
            while ((i = bis.read(readBuffer)) != -1) {
                // 1바이트씩 읽어들인 내용을 복사될 파일에 추가한다.
            	sb.append(new String(readBuffer, 0, i));
            }
	        return sb.toString();
		}
	}
	
	/**
	 * @author orange
	 * @category 파일 쓰기
	 * */
	public static void write(String content, String fullPath) throws IOException {
		try(FileOutputStream fos = new FileOutputStream(fullPath);
				BufferedOutputStream bos = new BufferedOutputStream(fos);){
			bos.write(content.getBytes(StandardCharsets.UTF_8));
		}
	}
	
	/**
	 * @author orange
	 * @category 일반 data를 암호화파일로 쓰기
	 * @param outputFileFullPath 생성될 경로와파일이름
	 * */
	public static void cipherWrite(String content, String outputFileFullPath, Cipher cipher) throws IOException {
		try(FileOutputStream fos = new FileOutputStream(outputFileFullPath);
				CipherOutputStream cos = new CipherOutputStream(fos, cipher);	){
			cos.write(content.toString().getBytes(StandardCharsets.UTF_8));
		}
	}
	
	/**
	 * @author orange
	 * @category 데이터를 binary로 변환
	 * */
	public static ResponseEntity<?> download(String fileName, byte[] data) {
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders
        	.setContentDisposition(
        		ContentDisposition.attachment()
        			.filename(fileName, StandardCharsets.UTF_8)
        			.build());
		httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		httpHeaders.setPragma("no-cache");
		httpHeaders.add(HttpHeaders.EXPIRES, "-1");
		httpHeaders.add(HttpHeaders.TRANSFER_ENCODING, "binary");
		return ResponseEntity.ok()
				.headers(httpHeaders)
				.body(data); 
	}
	
	/**
	 * @author orange
	 * @apiNote 기존에 있던 부장님이 만드신 소스 임병이 수석님이 재활용하기 위해서 복붙
	 * */
	public static void readAndWrite(final InputStream is, OutputStream os) throws IOException {
        byte[] data = new byte[2048];
        int read = 0;
        while ((read = is.read(data)) > 0) {
            os.write(data, 0, read);
        }
        os.flush();
        is.close();
    }
	
	
	
	
	
	/**
	 * @throws IOException 
	 * @category 파일 포맷을 확인한 뒤 jpeg가 아니면 암호화된 파일이라 판단한다.
	 * */
	public static boolean isJpeg(String dir, String fileNm) throws IOException {
		String fullPath = FileUtil.getFullPath(dir, fileNm);
		File file = new File(fullPath);
		ImageInputStream iis = ImageIO.createImageInputStream(file);
		Iterator<ImageReader> iter = ImageIO.getImageReaders(iis);
		if(!iter.hasNext()) {
			return false;
		}
		ImageReader reader = iter.next();
		String formatName = reader.getFormatName();
		iis.close();
		return formatName.equals("JPEG");
	}
	
	
	public static String decompress(byte[] value) throws Exception {

	    ByteArrayOutputStream outStream = new ByteArrayOutputStream();

	    GZIPInputStream gzipInStream = new GZIPInputStream(
	                new BufferedInputStream(new ByteArrayInputStream(value)));

	    int size = 0;
	    byte[] buffer = new byte[1024];
	    while ( (size = gzipInStream.read(buffer)) > 0 ) {
	        outStream.write(buffer, 0, size);
	    }
	    outStream.flush();
	    outStream.close();

	    return new String(outStream.toByteArray());
	}
	//출처: https://juntcom.tistory.com/79 [쏘니의 개발블로그:티스토리]
		
	// gzip 압축 풀기 
	public static StringBuilder deCompress(final byte[] compressed) throws IOException {
	    final StringBuilder outStr = new StringBuilder();
	   
	    if ((compressed == null) || (compressed.length == 0)) {
	      return null;
	    }
	    System.out.println("compressed=="+compressed.length);
	    if (isCompressed(compressed)) {
	    	final GZIPInputStream gis = new GZIPInputStream(new ByteArrayInputStream(compressed));
	    	final BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(gis, "UTF-8"));

	        String line;
	        while ((line = bufferedReader.readLine()) != null) {
	          outStr.append(line);
	        }
		  
		  
         } else {
        	 outStr.append(compressed);
	    }
	    return outStr;
	}

	public static boolean isCompressed(final byte[] compressed) {
		return (compressed[0] == (byte) (GZIPInputStream.GZIP_MAGIC)) && (compressed[1] == (byte) (GZIPInputStream.GZIP_MAGIC >> 8));
	}
}

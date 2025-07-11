package com.iaan.kepco.service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
//@RequiredArgsConstructor
public class FileService {

	@Value("${dwg.filePath}")
	private String dwgfolder;

	@Value("${dgn.filePath}")
	private String dgnfolder;

	public Resource getFileResource(String fileName) throws IOException {
		String filepath = dwgfolder + fileName;
		File file = new File(filepath);
		Path path = Paths.get(file.getAbsolutePath());
		try {
			Resource resource = new UrlResource(path.toUri());
			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				throw new IOException("Could not find file");
			}
		} catch (MalformedURLException e) {
			throw new IOException("Could not download file");
		}
	}


	public Resource getDwgFileResource(String fileName) throws IOException {
		String filepath =  fileName;
		File file = new File(filepath);
		Path path = Paths.get(file.getAbsolutePath());
		
		try {
			Resource resource = new UrlResource(path.toUri());
			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				throw new IOException("Could not find file");
			}
		} catch (MalformedURLException e) {
			throw new IOException("Could not download file");
		}
	}
	public String saveTestFile(MultipartFile multipartFile, String dwgId) {

		String fileName = multipartFile.getOriginalFilename();
		String filepath = dwgfolder + File.separator + fileName;
		File file = new File(filepath);

		Path path = Paths.get(file.getAbsolutePath());
		try {
			/* 실제 파일이 upload 되는 부분 */
			Files.copy(multipartFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
			// 저장후 db 저장


		} catch (IOException e) {
			e.printStackTrace();
		}

		return fileName;
	}

}

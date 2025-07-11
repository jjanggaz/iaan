package com.iaan.kepco.utils;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;

import java.net.*;
import java.io.*;

public class JsonToDtdxUtil {
	
	//싱글톤을 위한 코드
    private JsonToDtdxUtil(){}
    public static JsonToDtdxUtil getInstance(){
        return LazyHolder.INSTANCE;
    }
    private static class LazyHolder{
        private static final JsonToDtdxUtil INSTANCE=new JsonToDtdxUtil();
    }

    public JSONObject get(String jsonMessage,String filename) {
        try {
            //get 요청할 url을 적어주시면 됩니다. 형태를 위해 저는 그냥 아무거나 적은 겁니다.
            URL url = new URL(filename);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setConnectTimeout(5000); //서버에 연결되는 Timeout 시간 설정
            con.setReadTimeout(5000); // InputStream 읽어 오는 Timeout 시간 설정
            con.setRequestMethod("GET");
            con.setDoOutput(false);

            StringBuilder sb = new StringBuilder();
            if (con.getResponseCode() == HttpURLConnection.HTTP_OK) {
                BufferedReader br = new BufferedReader(
                        new InputStreamReader(con.getInputStream(), "utf-8"));
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line).append("\n");
                }
                br.close();
                JSONParser parser = new JSONParser();
              
                JSONObject jsonObject = (JSONObject) parser.parse(sb.toString());
                
                return jsonObject;
            } else {
                System.out.println(con.getResponseMessage());
            }

        } catch (Exception e) {
            System.err.println(e.toString());
        }
        return null;
    }

    public JSONObject post(String jsonMessage,String fileName){
        try {
            URL url = new URL(fileName);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setConnectTimeout(5000); 
            con.setReadTimeout(5000); 
            con.setRequestMethod("POST"); 
            con.setRequestProperty("Accept", "application/json");
            con.setRequestProperty("Content-type", "application/json");

            con.setDoInput(true);
            con.setDoOutput(true); //POST 데이터를 OutputStream으로 넘겨 주겠다는 설정
            con.setUseCaches(false);
            con.setDefaultUseCaches(false);

            OutputStreamWriter wr = new OutputStreamWriter(con.getOutputStream());
            wr.write(jsonMessage); //json 형식의 message 전달
            wr.flush();

            StringBuilder sb = new StringBuilder();
            if (con.getResponseCode() == HttpURLConnection.HTTP_OK) {
                BufferedReader br = new BufferedReader(
                        new InputStreamReader(con.getInputStream(), "utf-8"));
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line).append("\n");
                }
                br.close();
                JSONParser parser = new JSONParser();
                JSONObject jsonObject = (JSONObject) parser.parse(sb.toString());
              
                return jsonObject;
            } else {
                System.out.println(con.getResponseMessage());
            }
        } catch (Exception e){
            System.err.println(e.toString());
        }
        return null;
    }
}
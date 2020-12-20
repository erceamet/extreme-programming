package tests;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import org.junit.Test;
import server.Client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.BindException;
import java.net.HttpURLConnection;
import java.net.URL;

import static org.junit.Assert.fail;

public class TestValidJSON {
    /**
     * This is a test designed to check that the response from the server is
     */
    @Test
    public void servesJSON() throws InterruptedException, IOException {

        Thread serverThread = new Thread(() -> {
            try {
                new Client();
            } catch (BindException e) {
                fail("You need to close the currently running server before initiating this test.");
            } catch (IOException ignored) { }
        });
        serverThread.start();

        final  int waitTime = 25;
        int timeWaited = 0;
        while (!Client.ticketsReady.get()){
            if (timeWaited > 10000) {fail("Server took too long to load tickets");}
            Thread.sleep(waitTime);
            timeWaited += waitTime;
        }

        URL url = new URL("http://localhost:" + Client.PORT + "/getAllTickets");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");

        BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));

        StringBuilder resString = new StringBuilder();

        String line;
        while ((line = br.readLine()) != null)
            resString.append(line);

        br.close();

        Gson gson = new Gson();

        try {
            if(resString.toString().equals("null")) fail("The returned json is null - can't use that in the frontend");

            gson.fromJson(resString.toString(), Object.class);
            System.out.println("The json from the server is thus:-\n\n" + resString);
        } catch (JsonSyntaxException ex) {
            fail("Poorly formatted JSON - can't use in the frontend");
        }
    }
}

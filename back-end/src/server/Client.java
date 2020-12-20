package server;

import Data.Ticket;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import fi.iki.elonen.NanoHTTPD;
import org.apache.xmlrpc.XmlRpcException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class Client extends NanoHTTPD {
    static ServerConnection tracConnection;
    public static List<Ticket> tickets;
    public static AtomicBoolean ticketsReady = new AtomicBoolean(false);
    public static Analysis analysis = new Analysis();
    private static final Gson gson = new GsonBuilder().serializeNulls().create();

    public static final int PORT = 9772;

    public Client() throws IOException {
        super(PORT);
        start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("Running at http://localhost:" + PORT);

        tickets = new ArrayList<>();
    }

    protected void logMessage(String msg) {
        System.out.println(msg);
    }

    public static synchronized boolean login(Map<String, List<String>> credentials) {
        if (!ticketsReady.get()) {
            if (credentials.size() == 2) {
                if (credentials.containsKey("user") && credentials.containsKey("password")) {
                    tracConnection = new ServerConnection(credentials.get("user").get(0), credentials.get("password").get(0));
                    tracConnection.addNewTickets(tickets);
                    if (tickets.isEmpty()) {
                        return false;
                    } else {
                        ticketsReady.set(true);
                        return true;
                    }
                }
            }
            return false;
        }
        return true;
    }

    public synchronized static boolean logout() {
        tickets.clear();
        tracConnection = null;
        ticketsReady.set(false);
        return true;
    }

    public static String getAllTickets() throws XmlRpcException {
        if (ticketsReady.get()) {
            tracConnection.updateExistingTickets(tickets);
            tracConnection.addNewTickets(tickets);
            return objectToJson(tickets);
        }
        return "[]";
    }

    @Override
    public Response serve(IHTTPSession session) {
        logMessage(session.getUri());
        String responseMsg = "";
        String mime = "text/html";

        String[] paths = session.getUri().split("/");
        try {
            switch (paths[1]) {
                case "login":
                    responseMsg = Boolean.toString(login(session.getParameters()));
                    break;
                case "logout":
                    responseMsg = Boolean.toString(logout());
                    break;
                case "getAllTickets":
                    mime = "application/json";
                    responseMsg = getAllTickets();
                    break;
                case "getUsersStatistics":
                    ArrayList<ArrayList<String>> stats = analysis.getUsersStatistics(tickets);
                    responseMsg = objectToJson(stats);
                    mime = "application/json";
                    break;
                case "getBurnRate":
                    ArrayList<ArrayList<ArrayList<Integer>>> dataSets = analysis.getBurnRate(tickets);
                    responseMsg = objectToJson(dataSets);
                    mime = "application/json";
                    break;
                default:
                    throw new Exception("Unknown command");
            }
        } catch (Exception e) {
            System.err.println("Unexpected request" + session.getUri());
        }

        Response response = newFixedLengthResponse(Response.Status.OK, mime, responseMsg);

        response.addHeader("Access-Control-Allow-Origin", "*");
        return response;
    }

    public static void main(String[] args) throws IOException {
        new Client();
    }

    protected void closeServer() {
        stop();
    }

    public static String objectToJson(Object message) {
        return gson.toJson(message);
    }
}

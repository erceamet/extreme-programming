package tests;

import org.apache.xmlrpc.XmlRpcException;
import org.junit.Test;

import server.Client;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

public class ClientTest {

    @Test
    public void login() {
        Client.tickets = new ArrayList<>();
        HashMap<String, List<String>> credentials = new HashMap<>();
        assertFalse("No credentials given", Client.login(credentials));
        credentials.put("user", List.of("wrong"));
        assertFalse("Not all credentials given", Client.login(credentials));
        credentials.put("password", List.of("credentials"));
        assertFalse("Wrong credentials given", Client.login(credentials));
        credentials.put("user", List.of("test"));
        credentials.put("password", List.of("test8912"));
        assertTrue("Correct credentials given", Client.login(credentials));
    }

    @Test
    public void logout() throws XmlRpcException {
        Client.tickets = new ArrayList<>();
        assertTrue("Logout", Client.logout());
        assertEquals(Client.getAllTickets(), "[]");
        Client.login(Map.of("user", List.of("test"), "password", List.of("test8912")));
        assertNotEquals(Client.getAllTickets(), "[]");
        assertTrue("Logout", Client.logout());
    }

}
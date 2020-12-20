package tests;

import Data.Ticket;
import org.apache.commons.lang.time.DateUtils;
import org.apache.xmlrpc.XmlRpcException;
import server.ServerConnection;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ServerConnectionTest {

    ServerConnection serverConnection = new ServerConnection("test", "test8912");
    List<Ticket> tickets = new ArrayList<>();




    @org.junit.jupiter.api.Test
    void addNewTickets() {
        serverConnection.addNewTickets(tickets);
        assertNotEquals(0, tickets.size());
        Ticket newestTicket = tickets.get(0);
        int newestTicketId = newestTicket.getId();
        assertEquals(newestTicketId , tickets.size());

        int originalTicketsSize = tickets.size();
        tickets.remove(0);
        assertEquals(originalTicketsSize - 1,tickets.size());
        serverConnection.addNewTickets(tickets);
        assertEquals(originalTicketsSize, tickets.size());
    }

    @org.junit.jupiter.api.Test
    void getTicket() {
        try {
            Ticket ticket = serverConnection.getTicket(1);
            assertNotNull(ticket);
            assertEquals(1,ticket.getId());
        } catch (XmlRpcException e) {
            fail("The ticket being tested does not exist on trac");
        }
    }

    @org.junit.jupiter.api.Test
    void updateExistingTickets() throws XmlRpcException {
        serverConnection.addNewTickets(tickets);
        Ticket copyTicket = serverConnection.getTicket(12);
        int copyTicketIndex = tickets.size()-12;
        Ticket editTicket = tickets.get(copyTicketIndex);
        editTicket.setDescription("This is a test");

        assertNotEquals(editTicket.getDescription(),copyTicket.getDescription());

        Date originalEditTime = editTicket.getChangeTime();
        Date testTime = DateUtils.addHours(originalEditTime, -1);
        serverConnection.setLastUpdateTime(testTime);
        serverConnection.updateExistingTickets(tickets);
        Ticket originalTicket = tickets.get(tickets.size()-12);
        assertEquals(originalTicket.getDescription(),copyTicket.getDescription());







    }
}
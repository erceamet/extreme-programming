package tests;

import Data.Ticket;
import org.junit.Test;

import static junit.framework.Assert.assertTrue;

public class TicketLinkTestJava {
    @Test
    public void checkRegexWorking() {
        String exampleDescript1 = "[ticket:1]";
        assertTrue(Ticket.findRelatedTicket(exampleDescript1).contains(1));

        String exampleDescript2 = "[ticket:2]";
        assertTrue(Ticket.findRelatedTicket(exampleDescript2).contains(2));

        String exampleDescript3 = "Need to get in touch with Julie";
        assertTrue(Ticket.findRelatedTicket(exampleDescript3).isEmpty());
    }
}

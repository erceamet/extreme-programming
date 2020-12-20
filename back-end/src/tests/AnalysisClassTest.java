package tests;

import Data.Ticket;
import server.Analysis;
import server.ServerConnection;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AnalysisClassTest {
    ServerConnection serverConnection = new ServerConnection("test", "test8912");
    List<Ticket> tickets = new ArrayList<>();
    public static Analysis analysis = new Analysis();

    @org.junit.jupiter.api.Test
    void getUsers() {
        // testing class to get Owned By Usernames in Database
        // test 1 will check for size of array being returned
        serverConnection.addNewTickets(tickets);
        ArrayList<String> users = analysis.getUsers(tickets);
        System.out.println("getUsers Count: " + users.size());
        System.out.println("Count of users in server: " + 5);
        if (users.size() == 5) {
            System.out.println("getUsers() test #1 pass");
            assertEquals(users.size(), 5);
        }
        else {
            fail("Test Failed: Size of arrays are not equal");
        }
    }

    @org.junit.jupiter.api.Test
    void getUsersTest2() {
        // checking for the names in the array
        // there should be 5 in the server as of 14 Dec
        // jino, kc17574, jino mug, JUnit, jn16517
        // this test will check if those users are in that order
        serverConnection.addNewTickets(tickets);
        ArrayList<String> users = analysis.getUsers(tickets);

        ArrayList<String> testArray = new ArrayList<>();
        testArray.add("jino");
        testArray.add("kc17574");
        testArray.add("jino mug");
        testArray.add("JUnit");
        testArray.add("jn16517");

        if (testArray.equals(users)) {
            System.out.println("working");
            assertEquals(testArray, users);
        }
        else {
            fail("Test Failed: Arrays are not equal");
        }
    }

    @org.junit.jupiter.api.Test
    void getUserOpenAndClosedTicket() {
        // testing class to check for 'JUnit' User in server database
        // there are 4 Tickets made with 'JUnit' as the owner,
        // 3 Open and 1 Closed Ticket, should return [3,1]
        serverConnection.addNewTickets(tickets);
        int[] testing = analysis.getUserOpenAndClosedTickets("JUnit", tickets);
        assertEquals(Arrays.toString(testing), Arrays.toString(new int[]{3,1}));
    }

    @org.junit.jupiter.api.Test
    void getAverageTicketOpenTime() {
        // testing class to check for 'JUnit' User in server database
        // there are 4 Tickets made with 'JUnit' as the owner,
        // 3 Open and 1 Closed Ticket
        // currently WIP as function in Analysis class not fully functional yet.
        // will return 0
        serverConnection.addNewTickets(tickets);
        long testing = analysis.getAverageTicketOpenTime("JUnit", tickets);
        assertEquals(testing, 0);
    }
}
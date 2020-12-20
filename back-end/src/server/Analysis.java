package server;

import Data.Ticket;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;

public class Analysis {

    public Analysis(){
    }

    public ArrayList<ArrayList<ArrayList<Integer>>> getBurnRate(List<Ticket> tickets){
        ArrayList<ArrayList<ArrayList<Integer>>> dataSets = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();
        ArrayList<Integer> xCoords = new ArrayList<>();
        ArrayList<Integer> openYCoords = new ArrayList<>();
        ArrayList<Integer> closedYCoords = new ArrayList<>();
        for(int i = 30; i >= 0; i --){
            int totalOpenTickets = 0;
            int totalClosedTickets = 0;
            LocalDate newLocalDate = currentDate.minusDays(i);
            Date newDate = java.util.Date.from(newLocalDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()); // TODO untangle spaghetti
            for(Ticket ticket: tickets){
                if(ticket.getTimeCreated().before(newDate)){
                    totalOpenTickets++;
                    if(ticket.getStatus().equals("closed")){
                        totalClosedTickets++ ;
                    }
                }
            }
            xCoords.add(30 - i);
            openYCoords.add(totalOpenTickets);
            closedYCoords.add(totalClosedTickets);
        }
        ArrayList<ArrayList<Integer>> openData = new ArrayList<>();
        ArrayList<ArrayList<Integer>> closedData = new ArrayList<>();
        openData.add(xCoords);
        openData.add(openYCoords);
        dataSets.add(openData);
        closedData.add(xCoords);
        closedData.add(closedYCoords);
        dataSets.add(closedData);
        return dataSets;
    }

    public ArrayList<ArrayList<String>> getUsersStatistics(List<Ticket> tickets){ // [User, open tickets, closed tickets, percent open, average time of tickets open ]
        ArrayList<String> users = getUsers(tickets);
        ArrayList<ArrayList<String>> userData = new ArrayList<>();
        for(String user : users){
            ArrayList<String> data =  new ArrayList<>();
            data.add(user);
            int[] ticketTotals = getUserOpenAndClosedTickets(user,tickets);
            int openTickets  = ticketTotals[0];
            data.add(String.valueOf(openTickets));
            int closedTickets = ticketTotals[1];
            data.add(String.valueOf(closedTickets));
            int totalTickets = openTickets + closedTickets;
            try {
                float percentOpen = (openTickets/totalTickets) * 100;
                data.add(String.valueOf(percentOpen));

            }
            catch (ArithmeticException e){
                data.add("0");
            }
            long AverageTimeOfTickets = getAverageTicketOpenTime(user,tickets);
            data.add(String.valueOf(AverageTimeOfTickets));
            userData.add(data);
        }

        return userData;

    }

    public ArrayList<String> getUsers(List<Ticket> tickets){
        HashSet<String> users = new HashSet<>();
        for(Ticket ticket : tickets){

            users.add(ticket.getTicketIssuer());
            if(ticket.getStatus().equals("assigned")) {
                users.add(ticket.getTicketOwner());
            }
        }
        return new ArrayList<String>(users);
    }

    public int[] getUserOpenAndClosedTickets(String user, List<Ticket> tickets){
        int openTickets = 0;
        int closedTickets = 0;
        for (Ticket ticket : tickets){
            if(ticket.getTicketOwner().equals(user)){
                if(ticket.getStatus().equals("assigned")){
                    openTickets++;
                }
                if (ticket.getStatus().equals("closed")){
                    closedTickets++;
                }
            }
        }
        return new int[]{openTickets,closedTickets};
    }



    public long getAverageTicketOpenTime(String user, List<Ticket> tickets){
        ArrayList<Long> timeTicketIsOpen = new ArrayList<>();
        for(Ticket ticket : tickets){
            if(ticket.getTicketOwner().equals(user)){
                if (ticket.getStatus().equals( "closed")){
                    LocalDateTime timeOpened = ticket.getTimeCreated().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(); // TODO more spaghetti?
                    LocalDateTime timeClosed = ticket.getChangeTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(); // TODO even more spaghetti?
                    Duration timeOpen = Duration.between(timeOpened,timeClosed);
                    long diffHours = timeOpen.toHours();
                    timeTicketIsOpen.add(diffHours);
                }
            }
        }
        if(timeTicketIsOpen.size() == 0){
            return 0;
        }
        long total = 0;
        for(long time: timeTicketIsOpen){
            total += time;
        }
        long average = total/timeTicketIsOpen.size();
        return average;

    }
}

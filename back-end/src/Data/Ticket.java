package Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Ticket implements Comparable<Ticket> { //TODO Check constructor inputs match the database columns, add edit ticket method
    int id;
    String cc, ticketName, ticketOwner, keywords, description, ticketIssuer, priority, type, resolution, milestone, status, ts;
    List<Integer> relatedTo; // -1 = no related ticket
    Date changeTime, timeCreated;

    public String getTicketOwner() {
        return ticketOwner;
    }

    public String getStatus() {
        return status;
    }

    public Date getTimeCreated() {
        return timeCreated;
    }

    public String getTicketIssuer() {
        return ticketIssuer;
    }

    public String getDescription() {
        return description;
    }

    public Date getChangeTime() {
        return changeTime;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Ticket(int id, Date timeCreated, Date changeTime, HashMap data) {
        this.id = id;
        this.timeCreated = timeCreated;
        this.changeTime = changeTime;
        this.cc = (String) data.get("cc");
        this.ticketName = (String) data.get("summary");
        this.ticketOwner = (String) data.get("owner");
        this.keywords = (String) data.get("keywords");
        this.description = (String) data.get("description");
        this.ticketIssuer = (String) data.get("reporter");
        this.priority = (String) data.get("priority");
        this.type = (String) data.get("type");
        this.resolution = (String) data.get("resolution");
        this.milestone = (String) data.get("milestone");
        this.status = (String) data.get("status");
        this.ts = (String) data.get("_ts");
        this.relatedTo = findRelatedTicket();
    }


    public Integer getId() {
        return this.id;
    }

    public static List<Integer> findRelatedTicket(String descript) {
        List<Integer> relatedTickets = new ArrayList<>();
        Pattern regex = Pattern.compile("(?<=\\[ticket:)([\\d]+)(?=\\])");
        Matcher finder = regex.matcher(descript);
        while (finder.find())
            relatedTickets.add(Integer.parseInt(finder.group()));

        return relatedTickets;
    }

    private List<Integer> findRelatedTicket() {
        return findRelatedTicket(description);
    }

    @Override
    public String toString() {
        return "Data.Ticket{" +
                "id=" + id +
                ", cc='" + cc + '\'' +
                ", summary='" + ticketName + '\'' +
                ", owner='" + ticketOwner + '\'' +
                ", keywords='" + keywords + '\'' +
                ", description='" + description + '\'' +
                ", reporter='" + ticketIssuer + '\'' +
                ", priority='" + priority + '\'' +
                ", type='" + type + '\'' +
                ", resolution='" + resolution + '\'' +
                ", milestone='" + milestone + '\'' +
                ", status='" + status + '\'' +
                ", ts='" + ts + '\'' +
                ", changeTime=" + changeTime +
                ", timeCreated=" + timeCreated +
                '}';
    }

    @Override
    public int compareTo(Ticket t) {
        return t.id - this.id;
    }
}

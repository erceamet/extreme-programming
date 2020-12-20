package server;

import Data.Ticket;
import org.apache.xmlrpc.XmlRpcException;
import org.apache.xmlrpc.client.XmlRpcClient;
import org.apache.xmlrpc.client.XmlRpcClientConfigImpl;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

public class ServerConnection extends XmlRpcClient {
    XmlRpcClientConfigImpl connectionConfig = new XmlRpcClientConfigImpl();

    Date lastUpdateTime = new Date();

    public void setLastUpdateTime(Date lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }

    public ServerConnection(String username, String password) {
        try {
            connectionConfig.setServerURL(new URL("https://csee.essex.ac.uk/trac/ce320-14/login/xmlrpc"));
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        connectionConfig.setBasicUserName(username);
        connectionConfig.setBasicPassword(password);
        this.setConfig(connectionConfig);
    }

    public List<Ticket> addNewTickets(List<Ticket> currentTickets) {
        int id = 1;
        //java as index 0,1,2,3,4,5
        //stored in trac as 6,5,4,3,2,1
        if(!currentTickets.isEmpty()){
            //we'd need to check from last element
            Ticket newestTicket = currentTickets.get(0);
            id = newestTicket.getId()+1; //gets newest ticket's ID, adds 1 to the ID so we can check for newer ticket
        }
        while (true) {
            try {
                currentTickets.add(getTicket(id)); //adds to list of tickets array
                id++;
            } catch (XmlRpcException e) {
                //e.printStackTrace();
                break;
            }
        }
        Collections.sort(currentTickets);
        lastUpdateTime = new Date();
        System.out.println(lastUpdateTime);
        return currentTickets;
    }

    public List<Integer> findUpdatedTickets() {
        List<Integer> updatedTickets = new ArrayList<>();
        Object[] params = new Object[]{lastUpdateTime};
        try {
            Object[] s = (Object[]) this.execute("ticket.getRecentChanges", params);
            for (Object id : s) {
                updatedTickets.add((Integer) id);
            }
        } catch (XmlRpcException e) {
            e.printStackTrace();
        }
        lastUpdateTime = new Date();
        return updatedTickets;
    }

    public void updateExistingTickets(List<Ticket> knownTickets) throws XmlRpcException {
        List<Integer> modifiedTicketIds = findUpdatedTickets();
        if (modifiedTicketIds.isEmpty()) {
            return;
        } else
        for(int modifiedTicketID : modifiedTicketIds){
            for(Ticket knownTicket: knownTickets){
                if(knownTicket.getId()==modifiedTicketID){
                    Ticket replacementTicket = getTicket(modifiedTicketID);
                    int replacementIndex = knownTickets.size() - modifiedTicketID;
                    knownTickets.set(replacementIndex,replacementTicket);
                }
            }
        }
        Collections.sort(knownTickets);
    }

    public Ticket getTicket(Integer id) throws XmlRpcException {
        Object[] params = new Object[]{id};
        Object[] s = (Object[]) this.execute("ticket.get", params);//gets tickets from server (raw info)
        return new Ticket((Integer) s[0], (Date) s[1], (Date) s[2], (HashMap) s[3]);
    }

}



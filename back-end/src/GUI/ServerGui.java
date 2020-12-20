package GUI;

import server.Client;

import javax.swing.*;
import java.awt.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.IOException;

public class ServerGui extends Client {

    JFrame frame = new JFrame();
    JPanel panel1 = new JPanel();
    JTextArea console = new JTextArea(20, 20);




    private void initGUI(){
        console.setBackground(Color.ORANGE);
        console.setEditable(false);
        JButton closeButt = new JButton("Close Server");
        closeButt.setBackground(Color.RED);
        closeButt.setOpaque(true);
        closeButt.setBorderPainted(false);
        panel1.add(closeButt);
        panel1.setBackground(Color.DARK_GRAY);
        panel1.add(new JScrollPane(console));
        frame.add(panel1);
        closeButt.addActionListener(e -> closeServerGUI());
        frame.setSize(new Dimension(250,400));
        frame.setVisible(true);
        frame.setResizable(false);
        frame.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                super.windowClosing(e);
            closeServerGUI();
            }

        });


    }
    protected void closeServerGUI(){
        super.closeServer();
        frame.dispose();

        System.exit(0);

    }

    @Override
    protected void logMessage (String msg) {
        console.setText( console.getText() + "\n" + msg );
    }

    public static void main(String[] args) throws IOException {
        new ServerGui();

    }

    public ServerGui() throws IOException {
        super();
        initGUI();
    }

}

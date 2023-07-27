import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;
import java.io.IOException;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
public class MySQLTest {
    private static String readFileAsString() throws IOException {
        String filePath = "/Users/srushtinerkar/Downloads/ZillowCityData";
        byte[] bytes = Files.readAllBytes(Paths.get(filePath));
        return new String(bytes);
    }
    private static String[] splitCSVLine(String line) {
        List<String> elements = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean insideQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                insideQuotes = !insideQuotes;
            } else if (c == ',' && !insideQuotes) {
                elements.add(sb.toString().trim());
                sb.setLength(0); // Reset the StringBuilder
            } else {
                sb.append(c);
            }
        }

        elements.add(sb.toString().trim()); // Add the last element

        return elements.toArray(new String[0]);
    }

    private static String[] getPrices(String[] array, int num)  {
        if (array.length >= num+1) {
            int subsetSize = array.length - num; // Number of elements after the 5th element
            String[] subsetArray = new String[subsetSize];
            System.arraycopy(array, num, subsetArray, 0, subsetSize);
            return subsetArray;
        } else {
            // Return an empty array if there are less than 5 elements
            return new String[0];
        }
    }

    public static Double[] convertToIntArray(String[] stringArray) {
        Double[] intArray = new Double[stringArray.length];
        for (int i = 0; i < stringArray.length; i++) {
            String element = stringArray[i];
            if (element.isEmpty()) {
                intArray[i] = null;
            } else {
                intArray[i] = Double.parseDouble(element);
            }
        }
        return intArray;
    }

    public static void main(String[] args) throws Exception {

            String line = readFileAsString();
            String[] city = line.split("\n");
            String[] p = splitCSVLine(city[0]);
        String url = "jdbc:mysql://192.168.7.189:3306/target";
        String username = "test1";
        String password = "password";
        Connection myConn = DriverManager.getConnection(url, username, password);
        Statement myStmt = myConn.createStatement();
           int iti = 1;
           while (iti < city.length) {
               String[] parts = splitCSVLine(city[iti]);
               String[] prices = getPrices(parts, 8);
               String[] dates = getPrices(p, 8);
               FileRow row = new FileRow(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], prices, dates, iti);
               String[] statement = row.insertRow(myConn);
               try {
                   for (int i = 0; i < statement.length; i++) {
                       myStmt.addBatch(statement[i]);
                       myStmt.executeBatch();
                   }
               } catch (Exception e) {
                   e.printStackTrace();
               }
               iti++;
           }
       myConn.close();
    }
}


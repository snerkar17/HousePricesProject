import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.Statement;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.sql.PreparedStatement;
import java.sql.SQLException;
public class FileRow {
     static String RegionID;
     static String SizeRank;
     static String RegionName;
     static String RegionType;
     static String StateName;
     static String State, Metro, CountyName;
     static String[] price;
     static String[] date;
     static int iti;

    public FileRow(String id, String size, String reg, String type, String name,
                   String sta, String met, String county, String[] p, String[] d, int i) {
        RegionID = id;
        SizeRank = size;
         RegionName = reg;
         RegionType = type;
         StateName = name;
         State = sta;
         Metro = met;
         CountyName = county;
         price = p;
         date = d;
         iti = i;
    }
    public String[] insertRow(Connection myConn) throws Exception {
        String[] queryArray = new String[price.length];
        String sqlPrefix = "INSERT INTO zillow(RegionID, SizeRank, RegionName, RegionType, StateName, State, Metro, CountyName, CompleteDate, price) VALUES ";
        int queryIndex = 0;

        for (int i = 0; i < price.length; i++) {
            String priceValue = (price[i].isEmpty()) ? "NULL" : "'" + price[i] + "'";

            String values = "(" +
                    "'" + RegionID + "'," +
                    "'" + SizeRank + "'," +
                    "'" + RegionName + "'," +
                    "'" + RegionType + "'," +
                    "'" + StateName + "'," +
                    "'" + State + "'," +
                    "'" + Metro + "'," +
                    "'" + CountyName + "'," +
                    "'" + date[i] + "'," +
                    priceValue +
                    ")";

            queryArray[queryIndex] = sqlPrefix + values;
            queryIndex++;
        }

        return queryArray;

//        String queryString = "";
//        String sql = "INSERT INTO zillow(RegionID, SizeRank, RegionName, RegionType, StateName, State, Metro, CountyName, CompleteDate, price) VALUES (?,?,?,?,?,?,?,?,?,?)";
//        PreparedStatement statement = myConn.prepareStatement(sql);
//        try (myConn) {
//            for (int i = 0; i < price.length; i++) {
//                statement.setString(1, RegionID);
//                statement.setString(2, SizeRank);
//                statement.setString(3, RegionName);
//                statement.setString(4, RegionType);
//                statement.setString(5, StateName);
//                statement.setString(6, State);
//                statement.setString(7, Metro);
//                statement.setString(8, CountyName);
//                statement.setString(9, date[i]);
//                statement.setString(10, price[i]);
////                statement.addBatch();
//            }
//             queryString = statement.toString();

//            int[] rowsInserted = statement.executeBatch();

//        } catch (SQLException e) {
//            e.printStackTrace();
//        }

    }


}

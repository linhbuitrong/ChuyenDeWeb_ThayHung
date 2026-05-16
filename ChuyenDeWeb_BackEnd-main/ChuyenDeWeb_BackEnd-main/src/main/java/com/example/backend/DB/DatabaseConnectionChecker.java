package com.example.backend.DB;

import java.sql.*;

public class DatabaseConnectionChecker {

    private String jdbcUrl;
    private String username;
    private String password;

    public DatabaseConnectionChecker(String jdbcUrl, String username, String password) {
        this.jdbcUrl = jdbcUrl;
        this.username = username;
        this.password = password;
    }

    public void checkConnection() {
        try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password)) {
            if (conn != null) {
                DatabaseMetaData metaData = conn.getMetaData();
                System.out.println("Connected to database:");
                System.out.println("URL: " + metaData.getURL());
                System.out.println("User: " + metaData.getUserName());
                System.out.println("Database Product Name: " + metaData.getDatabaseProductName());
                System.out.println("Database Product Version: " + metaData.getDatabaseProductVersion());
                System.out.println("Driver Name: " + metaData.getDriverName());
                System.out.println("Driver Version: " + metaData.getDriverVersion());
            } else {
                System.out.println("Failed to make connection!");
            }
        } catch (SQLException e) {
            System.out.println("SQLException: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void getUserById(int id) {
        String sql = "SELECT id, username, email FROM users WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                int userId = rs.getInt("id");
                String username = rs.getString("username");
                String email = rs.getString("email");

                System.out.println("User found:");
                System.out.println("ID: " + userId);
                System.out.println("Username: " + username);
                System.out.println("Email: " + email);
            } else {
                System.out.println("User with ID " + id + " not found.");
            }

            rs.close();

        } catch (SQLException e) {
            System.out.println("SQLException: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/chuyendeweb";
        String user = "root";
        String pass = "";

        DatabaseConnectionChecker checker = new DatabaseConnectionChecker(url, user, pass);
        checker.checkConnection();
        checker.getUserById(1);
    }
}

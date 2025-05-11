<?php

function connectDb() {
    try {
        // Using PDO for database connection
        $host = 'localhost';
        $dbname = 'event_registration'; // Update with your DB name
        $username = 'root'; // Update with your DB username
        $password = ''; // Update with your DB password
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

        $pdo = new PDO($dsn, $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}
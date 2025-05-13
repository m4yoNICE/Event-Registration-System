<?php
function connectDb() {
    return new PDO('mysql:host=localhost;dbname=event_registration;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
}

<?php
require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../config/db.php';

Flight::set('db', connectDb());

Flight::route('GET /registrations', function () {
    $db = Flight::get('db');
    $stmt = $db->query("SELECT * FROM registrations");
    $registrations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    Flight::json($registrations);
});

Flight::route('POST /register', function () {
    $data = Flight::request()->data->getData();

    $fullName = $data['full_name'] ?? null;
    $email = $data['email'] ?? null;
    $birthdate = $data['birthdate'] ?? null;
    $phoneNumber = $data['phone_number'] ?? null;

    if (!$fullName || !$email || !$birthdate || !$phoneNumber) {
        Flight::json(['error' => 'All fields are required.'], 400);
        return;
    }

    $db = Flight::get('db');

    try {
        $stmt = $db->prepare("INSERT INTO registrations (full_name, email, birthdate, phone_number) VALUES (?, ?, ?, ?)");
        $stmt->execute([$fullName, $email, $birthdate, $phoneNumber]);
        Flight::json(['message' => 'Registration successful']);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Duplicate email
            Flight::json(['error' => 'This email is already registered.'], 400);
        } else {
            Flight::json(['error' => 'Failed to register.'], 500);
        }
    }
});

Flight::start();

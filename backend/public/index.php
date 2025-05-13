<?php
require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../config/db.php';

header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");


Flight::set('db', connectDb());

//GET
Flight::route('GET /api/registrations', function () {
    $db = Flight::get('db');
    $stmt = $db->query("SELECT * FROM registrations");
    $registrations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    Flight::json($registrations);
});

// POST 
Flight::route('POST /api/register', function () {
    $d = Flight::request()->data->getData();
    $required = ['full_name', 'email', 'birthdate', 'phone_number'];
    foreach ($required as $field) {
        if (empty($d[$field])) {
            Flight::json(['error' => 'All fields are required.'], 400);
            return;
        }
    }
    $registrationDate = date('Y-m-d H:i:s');
    try {
        Flight::get('db')->prepare(
            "INSERT INTO registrations (full_name, email, birthdate, phone_number) VALUES (?, ?, ?, ?)"
        )->execute([$d['full_name'], $d['email'], $d['birthdate'], $d['phone_number']]);
        Flight::json(['message' => 'Registration successful'], 201);
    } catch (PDOException $e) {
        Flight::json(
            ['error' => $e->getCode() == 23000 ? 'This email is already registered.' : 'Failed to register.'],
            $e->getCode() == 23000 ? 400 : 500
        );
    }
});
 
// PUT update registration
Flight::route('PUT /api/registrations/@id', function($id) {
    $data = Flight::request()->data->getData();
    if (empty($data['full_name']) || empty($data['email']) || empty($data['birthdate']) || empty($data['phone_number'])) {
        return Flight::json(['error' => 'All fields are required.'], 400);
    }
    $db = Flight::get('db');
    $stmt = $db->prepare("UPDATE registrations SET full_name = ?, email = ?, birthdate = ?, phone_number = ? WHERE id = ?");
    $stmt->execute([$data['full_name'], $data['email'], $data['birthdate'], $data['phone_number'], $id]);

    Flight::json(['message' => $stmt->rowCount() ? 'Registration updated.' : 'No changes made.']);
});

// DELETE registration
Flight::route('DELETE /api/registrations/@id', function($id) {
    $db = Flight::get('db');
    $stmt = $db->prepare("DELETE FROM registrations WHERE id = ?");
    $stmt->execute([$id]);

    Flight::json(['message' => $stmt->rowCount() ? 'Registration deleted.' : 'No registration found.'], $stmt->rowCount() ? 200 : 404);
});

Flight::start();
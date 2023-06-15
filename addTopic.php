<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $topicName = $data['topic_name'];
    $topicKeywords = implode(', ', $data['keywords']);


    $host = 'localhost'; 
    $username = 'root'; 
    $password = ''; 
    $database = 'topics'; 

    $conn = new mysqli($host, $username, $password, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO topics (topic_name, keywords) VALUES ('$topicName', '$topicKeywords')";

    if ($conn->query($sql) === TRUE) {
        echo 'Topic added successfully.';
    } else {
        echo 'Error adding topic: ' . $conn->error;
    }

    $conn->close();
}
?>

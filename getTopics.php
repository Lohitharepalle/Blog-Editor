<?php
$host = 'localhost'; 
$username = 'root'; 
$password = ''; 
$database = 'topics'; 

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM topics";
$result = $conn->query($sql);

$response = array();
if ($result->num_rows > 0) {
    $topics = array();
    while ($row = $result->fetch_assoc()) {
        $keywords = explode(',', $row['keywords']);
        $topics[] = array(
            'topic_name' => $row['topic_name'],
            'keywords' => array_map('trim', $keywords)
        );
    }

    $response['success'] = true;
    $response['topics'] = $topics;
} else {
    $response['success'] = false;
    $response['message'] = 'No topics found.';
}

echo json_encode($response);

$conn->close();
?>

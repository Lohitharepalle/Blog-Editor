<?php
$topicName = $_POST['topic_name'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "blog";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT content, tone FROM blog_data WHERE topic_name = '$topicName'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $content = $row['content'];
    $tone = $row['tone'];

    $response = [
        'success' => true,
        'content' => $content,
        'tone' => $tone
    ];
} else {
    $response = [
        'success' => false,
        'message' => 'Blog data not found.'
    ];
}
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>

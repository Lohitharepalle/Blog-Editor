<?php
$topicId = $_POST['topic_id'];
$topicName = $_POST['topic_name'];
$tone = $_POST['tone'];
$content = $_POST['content'];
$imageFile = $_FILES['image_file'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "blog";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM blog_data WHERE topic_name = '$topicName'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $sql = "UPDATE blog_data SET tone = '$tone', content = '$content' WHERE topic_name = '$topicName'";
    if ($conn->query($sql) === TRUE) {
        $response = [
            'success' => true,
            'message' => 'Blog content updated successfully.',
        ];
    } else {
        $response = [
            'success' => false,
            'message' => 'Failed to update blog content: ' . $conn->error,
        ];
    }
} else {
    $sql = "INSERT INTO blog_data (topic_id, topic_name, tone, content) VALUES ('$topicId', '$topicName', '$tone', '$content')";
    if ($conn->query($sql) === TRUE) {
        $response = [
            'success' => true,
            'message' => 'Blog content saved successfully.',
        ];
    } else {
        $response = [
            'success' => false,
            'message' => 'Failed to save blog content: ' . $conn->error,
        ];
    }
}
$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>

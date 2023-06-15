function openBlogEditor(topicId, topicName) {
    window.open('blogEditor.html?topicId=' + topicId + '&topicName=' + encodeURIComponent(topicName), '_blank');
}

function fetchTopics() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'getTopics.php', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                const topicList = document.getElementById('topic-list');
                topicList.innerHTML = ''; 

                response.topics.forEach(topic => {
                    const newTopicHTML = createTopicHTML(topic);
                    topicList.insertAdjacentHTML('beforeend', newTopicHTML);
                });
            } else {
                console.error(response.message);
            }
        }
    };

    xhr.send();
}

function createTopicHTML(topic) {
    return `
        <li id="topic-${topic.id}">
            <div class="topic">
                <h3>${topic.topic_name}</h3>
            </div>
            <div class="keywords">
                &nbsp; &nbsp;${topic.keywords.map(keyword => `<p>${keyword}</p>`).join('')}
            </div>
            <div class="buttons">
            <button class="btn" onclick="openBlogEditor(${topic.id}, '${topic.topic_name}')">Write</button>
            </div>
        </li>
    `;
}


window.addEventListener('DOMContentLoaded', fetchTopics);

function addTopic() {
    const topicName = document.getElementById('topicName').value;
    const topicKeywords = document.getElementById('topicKeywords').value;
    const data = {
        topic_name: topicName,
        keywords: topicKeywords.split(',').map(keyword => keyword.trim())
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'addTopic.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);

            if (response.success) {
                const topicList = document.getElementById('topic-list');
                const newTopicHTML = createTopicHTML(response.topic);
                topicList.insertAdjacentHTML('beforeend', newTopicHTML);

                document.getElementById('topicName').value = '';
                document.getElementById('topicKeywords').value = '';

                document.getElementById('addTopicForm').style.display = 'none';
            } else {
                console.error(response.message);
            }
        }
    };

    xhr.send(JSON.stringify(data));
}

// Event listener for add topic button
const addTopicBtn = document.getElementById('addTopicBtn');
addTopicBtn.addEventListener('click', function() {
    document.getElementById('addTopicForm').style.display = 'block';
});

// Event listener for save topic button
const saveTopicBtn = document.getElementById('saveTopic');
saveTopicBtn.addEventListener('click', addTopic);


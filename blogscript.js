function getParameterByName(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function setBlogTitle(title) {
    const blogTitle = document.getElementById('blogTitle');
    blogTitle.textContent = title;
}

const selectToneDropdown = document.getElementById('selectTone');
selectToneDropdown.addEventListener('change', function() {
    const selectedTone = selectToneDropdown.value;
    updateSelectedTone(selectedTone);
});

function updateSelectedTone(tone) {
    const selectedTone = document.getElementById('selectedTone');
    selectedTone.textContent = `Tone of the blog: ${tone}`;
}


window.addEventListener('DOMContentLoaded', function() {
    const topicName = decodeURIComponent(getParameterByName('topicName'));
    setBlogTitle(topicName);

    //const blogContent = getBlogContent();
    const blogContentDiv = document.getElementById('blog-content');
    blogContentDiv.innerHTML = blogContent;
});

/// Event listener for add image button
const addImageBtn = document.getElementById('addImageBtn');
addImageBtn.addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageDataUrl = e.target.result;
                const imgElement = document.createElement('img');
                imgElement.src = imageDataUrl;
                imgElement.alt = 'Blog Image';
                imgElement.style.maxWidth = '100%';
                imgElement.style.height = 'auto';
                $('#blog-content').append(imgElement);
            };
            reader.readAsDataURL(file);
        }
    });
    fileInput.click();
});

// Event listener for edit image button
const editImageBtn = document.getElementById('editImageBtn');
editImageBtn.addEventListener('click', function() {
    const width = prompt('Enter the width of the image in pixels:');
    const height = prompt('Enter the height of the image in pixels:');
    const imgElement = document.querySelector('#blog-content img');
    if (imgElement) {
        imgElement.style.width = width + 'px';
        imgElement.style.height = height + 'px';
    }
});

function saveBlog() {
    const topicId = getParameterByName('topicId');
    const topicName = getParameterByName('topicName');
    const tone = $('#selectTone').val();
    const content = $('#blog-content').html();

    const imageFile = $('#imageInput').prop('files')[0];
    const formData = new FormData();
    formData.append('topic_id', topicId);
    formData.append('topic_name', topicName);
    formData.append('tone', tone);
    formData.append('content', content);
    formData.append('image_file', imageFile);
    $.ajax({
        url: 'saveBlog.php',
        type: 'POST',
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function(response) {
            if (response.success) {
                alert('Blog saved successfully!');
            } else {
                console.error(response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error: ' + status + ' - ' + error);
        }
    });
}
//event listener for save button
const saveBlogBtn = document.getElementById('saveBlog');
saveBlogBtn.addEventListener('click', saveBlog);

window.addEventListener('DOMContentLoaded', function() {
    const topicName = decodeURIComponent(getParameterByName('topicName'));
    setBlogTitle(topicName);

    fetchBlogContent(topicName)
        .then(blogContent => {
            if (blogContent) {
                const blogContentDiv = document.getElementById('blog-content');
                blogContentDiv.innerHTML = blogContent.content;
                document.getElementById('selectTone').value = blogContent.tone;
                updateSelectedTone(blogContent.tone);
            }
        })
        .catch(error => {
            console.error('Failed to fetch blog content:', error);
        });
});

function fetchBlogContent(topicName) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'fetchBlog.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        resolve(response);
                    } else {
                        reject(response.message);
                    }
                } else {
                    reject('Request failed with status: ' + xhr.status);
                }
            }
        };
        const params = 'topic_name=' + encodeURIComponent(topicName);
        xhr.send(params);
    })
    .then(content => {
        return content;
    })
    .catch(error => {
        console.error('Failed to fetch blog content:', error);
    });
}

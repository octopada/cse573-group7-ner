function nerClassify() {
    let textArea = document.getElementById("classifyTexts");
    let modelSelect = document.getElementById("modelSelect");
    let modSelect = document.getElementById("modSelect");

    let requestBody = JSON.stringify({
        text: textArea.value,
        model: modelSelect.value,
        modifier: modSelect.value
    });

    console.log(requestBody)

    fetch('/classify', {
        method: 'post',
        body: requestBody,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json();
        }).then(function (data) {
        console.log('POST response:');
        console.log(data['result']);
    });
}
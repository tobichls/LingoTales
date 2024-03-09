text = document.getElementById("main_text");


opt1 = document.getElementById("opt1_lab");
opt2 = document.getElementById("opt2_lab");
opt3 = document.getElementById("opt3_lab");





function start(){
    fetch('http://127.0.0.1:5000/start')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); 
        })
        .then(data => {
            // Do something with the JSON data here
            console.log(data);
            update(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });


    
}





function update(data){
    text.innerHTML = data.message;

    opt1.innerHTML = data.options[0];
    opt2.innerHTML = data.options[1];
    opt3.innerHTML = data.options[2];
}



function next(){
    option1 = document.getElementById("option1");
    option2 = document.getElementById("option2");
    option3 = document.getElementById("option3");

    option = "";
    if(option1.checked){
        option = opt1.innerHTML;
    }if(option2.checked){
        option = opt2.innerHTML;
    }if(option3.checked){
        option = opt3.innerHTML;
    }


    data = {"option": option}


    fetch('http://127.0.0.1:5000/action', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(responseJson => {
        // Process the JSON response from the server
        console.log(responseJson);
        update(responseJson)
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

}
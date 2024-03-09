text = document.getElementById("main_text");


opt1 = document.getElementById("opt1_lab");
opt2 = document.getElementById("opt2_lab");
opt3 = document.getElementById("opt3_lab");


SYS_MSG = ""

INIT_MSG = ""

PANELS = []


function update(data){
    text.innerHTML = data.message;

    opt1.innerHTML = data.options[0];
    opt2.innerHTML = data.options[1];
    opt3.innerHTML = data.options[2];
}



function next(){
    scene = text.innerHTML;
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

    PANELS.push({"scene": scene,
                "options":[opt1.innerHTML, opt2.innerHTML, opt3.innerHTML],
                "userchoice": option})


    data = {"panels": PANELS}

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
        update(responseJson);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

}

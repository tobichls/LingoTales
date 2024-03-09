text = document.getElementById("main_text");


opt1 = document.getElementById("opt1_lab");
opt2 = document.getElementById("opt2_lab");
opt3 = document.getElementById("opt3_lab");


SYS_MSG = ""

INIT_MSG = "You walk up to the gate of a large looming mansion you "
INIT_OPTS = ["climb the gate", "walk left", "go right"]

PANELS = []


function update(data){
    text.innerHTML = data.scene;

    opt1.innerHTML = data.option1;
    opt2.innerHTML = data.option2;
    opt3.innerHTML = data.option3;
}

update({"scene": INIT_MSG, "option1": "climb the gate", "option2": "walk left", "option3": "walk right"})



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
                "option1": opt1.innerHTML,
                "option2": opt2.innerHTML,
                "option3": opt3.innerHTML,
                "userChoice": option})


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

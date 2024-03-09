// List of objects
const objects = [
];

// Define an empty list to store the objects
const objectList = [];

// Function to add objects to the list
function addStoryElement(scene, choice1, choice2, choice3, userChoice) {
  // Create a new object with the provided properties
  const newObject = {
    scene: scene,
    choice1: choice1,
    choice2: choice2,
    choice3: choice3,
    userChoice: userChoice
  };

  // Add the new object to the list
  objectList.push(newObject);
}

// Print the object list
console.log(objectList);

// Function for user choice
function userChoice(choice) {

    objectList[-1].userChoice = choice;
    console.log(objectList[-1]);

    // call backend API to save the user choice
}


document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");

    const scene = document.createElement("div");
    scene.id = "scene";
    
    const title = document.createElement("h1");
    title.id = "scene-title";
    const extraimage = document.createElement("img");
    extraimage.id = "extra-image";
    const image = document.createElement("img");
    image.id = "scene-image";
    
    const contentContainer = document.createElement("div");
    contentContainer.id = "content-container"; 
    
    const narration = document.createElement("p");
    narration.id = "narration";
    
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "button-container";

    contentContainer.appendChild(extraimage);
    contentContainer.appendChild(narration);
    contentContainer.appendChild(buttonContainer);
    
    scene.appendChild(title);
    scene.appendChild(image);
    scene.appendChild(contentContainer);
    gameContainer.appendChild(scene);

    let currentSceneAudio = null;

    function playSceneAudio(audioFile) {
        if (currentSceneAudio) {
            currentSceneAudio.pause();
            currentSceneAudio.currentTime = 0;
        }
    
        if (audioFile) {
            currentSceneAudio = new Audio(audioFile);
            currentSceneAudio.loop = true;  
            currentSceneAudio.volume = 0.6; 
            currentSceneAudio.play().catch(error => console.error("Audio playback error:", error));
        }
    }
    
    // Scene data
    const scenes = [
        {   // Scene 0
            title: "The Detective’s Office",
            text: "Jack stares at the rain, the reflection of his weary face staring back. Two years. Two unsolved cases. Two tragedies that had shattered his reputation. ",
            background: "office.jpg",
            audio: "sounds/rain.mp3",
            choices: [
                { text: "Look through the Window", nextScene: 1 },
                { text: "Investigate Room", nextScene: 2 },
                
            ]
        },
        {   // Scene 1
            title: "A Creak Near the Window",
            text: "A faint creak. A noise near the window. Jack’s pulse quickens.",
            background: "window_creak.jpg",
            audio: "sounds/creak.mp3",
            choices: [
                { text: "Look Out", nextScene: 3 },
                { text: "Stay Silent", nextScene: 4 }
            ]
        },
        {   // Scene 2
            title: "A Mysterious Letter",
            text: "Jack walks to the door. In his postbox, a single letter rests inside. No return address. Just his name.",
            background: "postbox.jpg",
            audio: "sounds/letter_drop.mp3",
            choices: [
                { text: "Open It", nextScene: 5 },
                { text: "Ignore It", nextScene: 6 }
            ]
        },
        {   //scene 3
            title: "An Unexpected Letter",
            text: "Jack scans the room. Nothing unusual—except a single letter lying on the table.",
            background: "letter_table.jpg",
            audio: "sounds/silence.mp3",
            choices: [
                { text: "Open the Letter", nextScene: 5 },
                { text: "Ignore It", nextScene: 6 }
            ]
        },
        
        {   //  Scene 4
            title: "A Letter Slips Through the Door",
            text: "A soft rustling sound. Jack turns just in time to see an envelope slide under his door.",
            background: "letter_door.jpg",
            audio: "sounds/paper_slide.mp3",
            choices: [
                { text: "Open It", nextScene: 5 },
                { text: "Ignore It", nextScene: 6 }
            ]
        },
        
        {   //scene 5
            title: "A Cryptic Message",
            text: "Inside, a message scrawled in hurried handwriting: 'A girl is lost. Find her before it's too late.' At the bottom—coordinates to an unknown place.",
            background: "letter.png",
            extraimage: "paper.png",
            audio: "sounds/paper_rustle.mp3",
            choices: [
                { text: "Take It Seriously", nextScene: 7 },
                { text: "Ignore It", nextScene: 6 }
            ]
        },
        {   // Scene 6
            title: "A Haunting Reminder",
            text: "Jack turns away, but the envelope remains in sight, taunting him. A memory stirs—something from his past that could destroy his career. His hands tremble.",
            background: "haunted_memory.jpg",
            audio: "sounds/heartbeat.mp3",
            choices: [
                { text: "Open the Letter", nextScene: 5 }
            ]
        },
        {   //scene 7
            title: "The Mysterious Coordinates",
            text: "Jack marks the coordinates on the map. Three locations stand out as potential leads.",
            background: "map.png",
            audio: "sounds/thinking.mp3",
            choices: [
                { text: "Forest", nextScene: 11 },
                { text: "Library", nextScene: 12 },
                { text: "School", nextScene: 13 }
            ]
        },
        
        {   //scene 8
            title: "Duskwood Forest",
            text: "Jack arrives at Duskwood Forest. The dense trees create an eerie silence. Following the coordinates, he finds a cave hidden behind overgrown vines.",
            background: "duskwood_forest.png",
            audio: "sounds/forest_ambience.mp3",
            choices: [
                { text: "Enter the cave", nextScene: 14 }
            ]
        },
        {   //scene 9
            title: "Dead Ends",
            text: "Jack searches the library and school, but finds no useful clues. The coordinates must have meant something else.",
            background: "empty_library.png", // or "empty_school.png"
            audio: "sounds/failure.mp3",
            choices: [
                { text: "Recheck the map", nextScene: 7 } // Goes back to Scene 7
            ]
        },
        {   //scene 10
            title: "Footstep Trails",
            text: "Jack reaches the cave. He sees trails of boots, small girl footsteps, and animal tracks leading inside. The decision is critical.",
            background: "cave_entrance.png",
            audio: "sounds/ominous_wind.mp3",
            choices: [
                { text: "Follow into the cave", nextScene: 11 }
            ]
        },
        {   //scene 11
            title: "Into the Darkness",
            text: "Jack steps deeper into the cave. The darkness is suffocating, and the air feels heavy. He can barely see his own hands. Every step echoes off the rocky walls.",
            background: "cave_dark.png",
            audio: "sounds/distant_drips.mp3",
            choices: [
                { text: "Turn on flashlight", nextScene: 12 },
                { text: "Walk silently in the dark", nextScene: 13 }
            ]
        },
        {   //scene 12
            title: "The Junction",
            text: "Jack lights his flashlight, and the cave walls flicker with eerie shadows. As he moves forward, he reaches a junction where three different trails appear on the dusty ground.",
            background: "cave_junction.png",
            audio: "sounds/flickering_fire.mp3",
            choices: [
                { text: "Follow the smudged footprints", nextScene: 13 },
                { text: "Follow the girl's footsteps", nextScene: 13 },
                { text: "Follow the boot prints", nextScene: 14 }
            ]
        },
        {   //scene 13
            title: "The Bear Attack",
            text: "As Jack cautiously walks in the dark, he hears a deep growl. Suddenly, a massive bear lunges at him from the shadows! His heart pounds as the beast snarls, ready to strike.",
            background: "cave_bear.png",
            audio: "sounds/bear_roar.mp3",
            choices: [
                { text: "Use fire to scare the bear and run", nextScene: 12 } 
            ]
        },
        {   //scene 14
            title: "The Stone Door Puzzle",
            text: "Jack follows the trail of boots deeper into the cave. He arrives at an ancient stone door covered in strange symbols. A puzzle mechanism is embedded in the rock, blocking the way forward.",
            background: "stone_door.png",
            audio: "sounds/mystery_puzzle.mp3",
            choices: [
                { text: "Solve the puzzle to open the door", nextScene: 15 }
            ]
        },
        {
            // Scene 16
            title: "The River Crossing",
            text: "Jack slides down a muddy slope and lands at the riverbank. The water flows swiftly, blocking his path forward. He must decide how to cross.",
            background: "riverbank.png",
            audio: "sounds/river_flow.mp3",
            choices: [
                { text: "Cross using the bridge", nextScene: 16 },
                { text: "Cross using the boat", nextScene: 17 }
            ]
        },
        {
            // Scene 17
            title: "The Broken Bridge",
            text: "Jack approaches a narrow, unstable bridge. A strange puzzle is carved into the wooden planks, requiring a four-digit code to proceed.",
            background: "bridge.png",
            extraImage: "bridge_puzzle.png", // Additional image for the puzzle
            audio: "sounds/creaking_bridge.mp3",
            input: {
                type: "text",
                placeholder: "Enter the four-digit code",
                correctAnswer: "2578",
                successMessage: "The bridge stabilizes, allowing Jack to cross safely.",
                failureMessage: "The bridge collapses! Jack barely manages to hold onto the edge."
            },
            choices: [
                { text: "Submit Answer", validateInput: true, correctNextScene: 19, wrongNextScene: 20 }
            ]
        },
        {
            title: "The Boat Crossing",
            text: "Jack finds an old boat but needs to locate the missing row to proceed.",
            background: "river.png",
            extraImage: "boat_puzzle.png", // Image containing the row
            audio: "sounds/water_ripple.mp3",
            correctArea: { x: 150, y: 250, width: 50, height: 50 }, // Adjust coordinates based on the image
            successMessage: "Jack finds the row and can now cross the river!",
            nextScene: 20
        }
    ];

    function loadScene(sceneIndex) {
    const sceneData = scenes[sceneIndex];
    if (!sceneData) {
        console.error(`Scene ${sceneIndex} not found!`);
        return;
    }
// Check if the scene should load an external HTML file
        /*if (sceneIndex === 15) {  // Stone Door Puzzle Scene
            window.location.href = "puzzle.html"; // Redirects to another HTML file
            return;
        }*/
    title.textContent = sceneData.title;
    narration.textContent = sceneData.text;
    gameContainer.style.backgroundImage = `url('images/${sceneData.background}')`;

    if (sceneData.extraimage) {
        extraimage.style.display = "block";
        extraimage.src = `images/${sceneData.extraimage}`;
    } else {
        extraimage.style.display = "none";
    }

    buttonContainer.innerHTML = "";

    // Check if scene has an input field
    if (sceneData.input) {
        const inputField = document.createElement("input");
        inputField.type = sceneData.input.type;
        inputField.placeholder = sceneData.input.placeholder;
        inputField.id = "scene-input";
        
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit Answer";
        submitButton.classList.add("choice-button");

        submitButton.addEventListener("click", () => {
            const userAnswer = inputField.value.trim().toLowerCase(); 
            if (userAnswer === sceneData.input.correctAnswer.toLowerCase()) {
                alert(sceneData.input.successMessage);
                loadScene(sceneData.choices[0].correctNextScene);
            } else {
                alert(sceneData.input.failureMessage);
                loadScene(sceneData.choices[0].wrongNextScene);
            }
        });

        buttonContainer.appendChild(inputField);
        buttonContainer.appendChild(submitButton);
    }

    // Add choice buttons if available
    sceneData.choices.forEach(choice => {
        if (!choice.validateInput) {
            const button = document.createElement("button");
            button.textContent = choice.text;
            button.classList.add("choice-button");
            button.addEventListener("click", () => loadScene(choice.nextScene));
            buttonContainer.appendChild(button);
        }
    });

    playSceneAudio(sceneData.audio);
}

function playSceneAudio(audioPath) {
    const audio = new Audio(audioPath);
    audio.play();
}

// Start the game
loadScene(0);
});

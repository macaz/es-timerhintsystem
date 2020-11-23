# Timer & hint system
A cross platform timer and hint application for escape rooms, using electron js, socket.io and mqtt.js.

![finished app](https://iili.io/FEq6zl.md.jpg)

### The concept
I was working on building an escape room and wanted a system to display the timer and hints to the players while keeping them immersed in the game.

With many of the rooms I have played, they used the shelf timers and gave players hints either via a walkie talkie or a loud speaker. I found could easily take me out of the immersion of the room so wanted to find a better system.
I created this program to be used with a “smart mirror”, so it will display the game timer and if the players need a hint the game master can send them a hint.

As I was creating the rooms, I had puzzles, props, lights, audio etc using MQTT so they could be controlled automatically/remotely, potentially giving the player a more dynamic experience.

![Initial concept](https://iili.io/FEqU5G.md.jpg)
> testing the smart mirror with an early version of the app

### Setup

You will need to have [Node.js](https://nodejs.org/en/download/).

```
# Clone the repository - Requires Git
git clone https://github.com/macaz/timer-hint-system

# Install dependancies in project folder
npm install

# Setup MQTT broker connection - in main.js
    1. Setup the IP address and port of the MQTT broker.
    2. Set the topic to subscribe to.
    3. Give the device a name so its easier to identify.

# Setup Timer - in renderer.js
    1. Specific the amount of time for the game in minutes.

# Run the app
npm start
```

### Sending messages to the application

Once the application is running you can publish messages to the topic the application has subscribed to.
The message that the topic receives will trigger the following functionalities:

#### start-game
```
Starts the count down timer, if the timer is paused it will resume from there.
```

#### pause-game
```
Pauses the count down timer.
```

#### reset-game
```
Resets the count down timer to the intial value and clears any hint text.
```

**Note: If the message received if anything else than the messages above, it will display that as a hint to the players.**

Currently the hint text will stay on the screen until another hint is sent or the game is reset, however this could be modified to dissapear after a certain amount of time.

You can remove the hint text by sending an empty string ("") to the topic.


![command prompt](https://iili.io/FEqPX2.md.jpg)
> a demo of sending the commands via MQTT

This has been tested using VS code on windows and mac.
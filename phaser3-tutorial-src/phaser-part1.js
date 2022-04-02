
// this config obj is being called when we make the game under this obj on the next comment.
//the below code is the documentation for the config obj

// The config object is how you configure your Phaser Game. There are lots of options that can be placed in this object and as you expand on your Phaser knowledge you'll encounter more of them. But in this tutorial we're just going to set the renderer, dimensions and a default Scene

// TYPE PROPERTY ==========
// The type property can be either Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO. This is the rendering context that you want to use for your game. The recommended value is Phaser.AUTO which automatically tries to use WebGL, but if the browser or device doesn't support it it'll fall back to Canvas. The canvas element that Phaser creates will be simply be appended to the document at the point the script was called, but you can also specify a parent container in the game config should you wish.



var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// this var I assume is making the new game with the new Phaser.Game method that Phaser uses
// the instance is explained below

//An instance of a Phaser.Game object is assigned to a local variable called game and the configuration object is passed to it. This will start the process of bringing Phaser to life.

// so this instance is necessary
var game = new Phaser.Game(config);

// THE BELOW DOCUMENTATION IS FOR THE PRELOAD FUNCTION

//Let's load the assets we need for our game. You do this by putting calls to the Phaser Loader inside of a Scene function called preload. Phaser will automatically look for this function when it starts and load anything defined within it.
//
// Currently the preload function is empty. Change it to:


function preload(){
    this.load.image('sky','assets/sky.png');
    this.load.image('ground','assets/platform.png');
    this.load.image('star','assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        {frameWidth: 32, frameHeight:48}
    )
}

// THIS DOCUMENTATION IS FOR THE CODE BELOW THE CREATE FUNCTION

//The values 400 and 300 are the x and y coordinates of the image. Why 400 and 300? It's because in Phaser 3 all Game Objects are positioned based on their center by default. The background image is 800 x 600 pixels in size, so if we were to display it centered at 0 x 0 you'd only see the bottom-right corner of it. If we display it at 400 x 300 you see the whole thing.

//The order in which game objects are displayed matches the order in which you create them. So if you wish to place a star sprite above the background, you would need to ensure that it was added as an image second, after the sky image:

// note that the sky image is on the first line of code so it will be in the background anything on top of that will got on top and so on and so fourth

// Under the hood this.add.image is creating a new Image Game Object and adding it to the current Scenes display list. This list is where all of your Game Objects live. You could position the image anywhere and Phaser will not mind. Of course, if it's outside of the region 0x0 to 800x600 then you're not going to visually see it, because it'll be "off screen", but it will still exist within the Scene.

// Glancing quickly at the code you'll see a call to this.physics. This means we're using the Arcade Physics system, but before we can do that we need to add it to our Game Config to tell Phaser our game requires it. So let's update that to include physics support. Here is the revised game config:

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;

function create(){
    this.add.image(400,300,'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400,568,'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100,450,'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);


    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1

    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);


    // The process is similar to when we created the platforms Group. As we need the stars to move and bounce we create a dynamic physics group instead of a static one.


    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX:70}
    });
    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    //If we were to run the code like it is now the stars would fall through the bottom of the game and out of sight. To stop that we need to check for their collision against the platforms. We can use another Collider object to do this:
    this.physics.add.collider(stars, platforms);

    //As well as doing this we will also check to see if the player overlaps with a star or not:
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // This tells Phaser to check for an overlap between the player and any star in the stars Group. If found then they are passed to the 'collectStar' function:
    function collectStar (player, star)
    {
        star.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);
    }
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}


function update(){


    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }

}

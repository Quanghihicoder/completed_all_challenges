## Tiler Backend Interview Challenge

> ## This is a pair programming challenge to be conducted between the interview members

### The context: You've just been sent a slack message from a team mate asking to pair program on a new task

> Heyo Fren 👋,
>
> I've been working on the ticket to build out that new image tiler script for the Visualiser backend. It has to be a CLI tool that we can use on the server when we process images.
> I've made a start on the tool and can read in image files, have some argument parsing and have built out an Image interface using 'sharp.js' to handle manipulation, resizing, cropping and saving.
>
> The issue is I'm a bit stuck on the tiling / level logic and was wondering if you could help me out?
> I made a function produceTiles with the arguments I think it needs and have managed to produce a few levels of images but only the tile in the top left corner.
>
> Really appreciate if you could spend 30 minutes pairing with me on it. Will owe you a 🍩

### The rules

You can ask your interviewers questions and for help just like you would in a normal programming environment - heck you can even google things if you need to look up an API or interface.

As you'll be sharing your screen during the session you can prepare by cloning this repo onto your machine and loading it up in your IDE.

Make sure you have a read of the background information below as well and come ready with any questions you may have.

### A bit more background

Our visualiser has a feature that allows customers to view the source photos that they uploaded as part of a survey. One survey may consist of several thousand large (30+ MB) photos. To make viewing snappy, we cut each photo up into tiles. Tiles are then generated for the photo at full resolution, at 1⁄2 resolution, at 1⁄4 resolution, at 1⁄8 resolution, and so on, until the photo cannot be shrunk further (i.e. its size is 1 × 1).

By convention, we call the lowest resolution "level 0", so that at level 0, there is only a single tile of size 1 × 1. At level 1, there is a single tile of size at most 2 × 2; at level 2, a single tile of at most size 4 × 4. This continues until the result would exceed the size of a single tile, at which point the level should contain as many tiles as required to cover the whole photo at that level's resolution. At the final level, there is no loss of resolution from the original photo.

For a photo with resolution n × m, there will be `1 + ⌈log2 max(n, m)⌉` levels of tiles.

How does tiling help? Well, say that the photo is 7000 × 5000 pixels and we are viewing it in a viewport that is 1000 × 800 (0.8 megapixels). The highest-numbered level of this photo is 13, and it contains 28 tiles across and 20 tiles down. But the browser can choose to load the tiles from level 10, where there are only 4 tiles across and 3 down, for a total of 0.8 megapixels, instead of the full photo at 35 megapixels. It also means that when zooming into different parts of the image, we only have to load higher-resolution imagery for that part.

Our job is to tile the photos. Some considerations:

- You may use an image library for your chosen language for image manipulation, but the level/tiling logic should be your own.
- For this challenge we will use a maximum tile size of 256 × 256: eg. if the photo is 1025 × 766, you'll end up with one-pixel slices to the right and you'll be a couple of pixels short at the bottom. That is fine.
- Your utility takes one argument, the source file, and it writes a "pyramid" of tiles to an appropriately named directory in the same directory as the source file. Name your files "L/x_y.jpg" where
  - L is the tile level,
  - x is the tile's x coordinate and
  - y is the tile's y coordinate. Coordinates start at 0,0 in the top-left corner.
- To make your setup repeatable, your code should be packaged with any dependencies in a [Docker](https://www.docker.com/) container using a Dockerfile.

### How to run locally

Run locally using nodejs (Version 20.3.0 or newer):

`yarn install`

`yarn start sample_0.png`

Run using Docker:

1. Ensure docker is running on your machine
2. `./build.sh`
3. `./run.sh sample_0.png`

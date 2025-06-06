FILE_PATH="$PWD/$1"
NAME="$(basename ${FILE_PATH%%.*})"
EXTENSION="${FILE_PATH##*.}"
IMAGE_OUTPUT_NO_EXTENSION="${FILE_PATH%%.*}-tiled"
echo $IMAGE_OUTPUT_NO_EXTENSION

docker run -v $FILE_PATH:/lib/image.$EXTENSION -v $IMAGE_OUTPUT_NO_EXTENSION:/lib/tiled-image -t challenge-tiler-cli:latest yarn start /lib/image.$EXTENSION
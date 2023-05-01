![woops](https://github.com/erotourtes/wayce/blob/main/.github/Public/Icon.svg)
# Wayce
Wayce - way trace for not wayceting your time  

Simple [tf-idf](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) search engine with web interface

### How to use
Run `npm run compile`, open http://localhost:3000/ 

[example.webm](https://user-images.githubusercontent.com/67370189/235439208-465b6b3d-afd3-4c7e-8a77-7f1645f40af4.webm)

### Comparison
I used to delete elements from the start of an array 🤦, so it was super slow. 
I use built-in node time measurement tools and the `time` command. The comparison is approximate, as I've done the **simplest** benchmarking.

![woops](https://github.com/erotourtes/wayce/blob/main/.github/Public/slow.png)
![woops](https://github.com/erotourtes/wayce/blob/main/.github/Public/fast.png)

> Idk why the build-in function shows so little time. Maybe there was an overflow or I just made a mistake measuring it

There were 2 possible solutions - either to use a queue or save the index and avoid deleting. I chose the first one, as it is more fascinating. There is no difference between these 2 implementations in a short time comparison.

![woops](https://github.com/erotourtes/wayce/blob/main/.github/Public/with-array.png)
![woops](https://github.com/erotourtes/wayce/blob/main/.github/Public/with-queue.png)

Also, there is a basic [stemming algorithm](https://github.com/erotourtes/wayce/blob/main/src/Engine/Lexer/Stemming.ts#L4) 

> with stemming

![woops](https://github.com/erotourtes/wayce/blob/main/.github/Public/with-stemming.png)

> without stemming

![woops](https://github.com/erotourtes/wayce/blob/main/.github/Public/without-stemming.png)

### Project diagram

![woops](https://github.com/erotourtes/wayce/blob/main/.github/Public/diagram.svg)

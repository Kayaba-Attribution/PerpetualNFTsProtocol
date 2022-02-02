const { createCanvas, loadImage } = require('canvas')
allImages = [
  loadImage('./1.png'),
  loadImage('./2.png'),
  loadImage('./3.png'),
  loadImage('./4.png'),
  loadImage('./5.png'),
  loadImage('./6.png'),
  loadImage('./7.png'),
  loadImage('./8.png'),
  loadImage('./9.png'),
];





const genes = {};


Promise.all(allImages).then(async (images) => {
  const L = images.length;
  for(let i0 = 0; i0 < L; i0++) {
    for(let i1 = 0; i1 < L; i1++) {
      for(let i2 = 0; i2 < L; i2++) {
        for(let i3 = 0; i3 < L; i3++) {
          const gen = [i0, i1, i2, i3].join(',');
          if(genes[gen]) {
            return;
          }
          genes[gen] = true;

          const canvas = createCanvas(512, 512);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(images[i0], 0, 0, 250, 250, 0, 0, 250, 250);
          ctx.drawImage(images[i1], 0, 250, 250, 250, 0, 250, 250, 250);
          ctx.drawImage(images[i2], 250, 0, 250, 250, 250, 0, 250, 250);
          ctx.drawImage(images[i3], 250, 250, 250, 250, 250, 250, 250, 250);


          const fs = require('fs')
          const out = fs.createWriteStream('./generated/'+Object.keys(genes).length+'.jpeg');
          const stream = canvas.createJPEGStream();
          stream.pipe(out)
          await new Promise(resolve => {
            out.on('finish', () => {
              console.log('The JPEG file was created.')
              resolve();
            })
          });

          // Disable 2x2 chromaSubsampling for deeper colors and use a higher quality
          // const stream = canvas.createJPEGStream({
          //   quality: 0.95,
          //   chromaSubsampling: false
          // })

        }
      }
    }
  }
});


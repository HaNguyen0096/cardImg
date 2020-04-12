const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;
const BLUR_LEVEL = 10;

var fileSelect = document.getElementById('fileSelect')
fileSelect.addEventListener('change', function(){
  if(!fileSelect){
    return;
  }

  let insC = new cardImg();
});


class cardImg {
  constructor(){
    this.canvas = document.getElementById('result');
    this.canvas.width = CANVAS_WIDTH
    this.canvas.height = CANVAS_HEIGHT
    this.ctx = this.canvas.getContext('2d')
    this.img = new Image()
    this.img.onload = () => this.imageLoaded();
    this.bgImg = null;
    this.cardImg = null;

    this.loadImage();
    var self = this;
  }

  start(){
    this.loadImage('fileSelect', (img) => {
      self.img = img;
    })
  }

  loadImage(){
    let input = document.getElementById('fileSelect')
    let reader = new FileReader();
    reader.onload = (event) => {
      this.img.src = event.target.result;
    }
    
    reader.readAsDataURL(input.files[0])
  }

  imageLoaded(){
    this.cropBgImg();
    this.cropCardImage();
    this.drawBlurBackgroundImage();
    this.drawMark();
    this.drawCardImage();
  }

  cropBgImg(){
    this.bgImg = document.createElement('canvas');
    this.bgImg.width = CANVAS_WIDTH;
    this.bgImg.height = CANVAS_HEIGHT;
    let bg = this.bgImg.getContext('2d')
    let x = Math.abs((CANVAS_WIDTH/2) - (this.img.width/2))
    let y = Math.abs((CANVAS_HEIGHT/2) - (this.img.height/2))
    if(this.img.width>CANVAS_WIDTH && this.img.height>CANVAS_HEIGHT){
      bg.drawImage(this.img, x, y, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
    else if(this.img.width>CANVAS_WIDTH && this.img.height<CANVAS_HEIGHT){
      bg.drawImage(this.img, x, 0, CANVAS_WIDTH, this.img.height, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
    else if(this.img.width<CANVAS_WIDTH && this.img.height>CANVAS_HEIGHT){
      bg.drawImage(this.img, 0, y, this.img.width, CANVAS_HEIGHT, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
    else if(this.img.width<CANVAS_WIDTH && this.img.height<CANVAS_HEIGHT){
      bg.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
  }

  cropCardImage() {
    let cardWidth = 0.6*this.img.width
    let cardHeight = 0.8*this.img.height

    this.cardImg = document.createElement('canvas')
    this.cardImg.width = cardWidth
    this.cardImg.height = cardHeight
    let card = this.cardImg.getContext('2d')
    card.drawImage(this.bgImg, 0, 0, this.bgImg.width, this.bgImg.height, 0, 0, cardWidth, cardHeight)
  }

  drawCardImage(){
    let cardWidth = 0.6*this.bgImg.width
    let cardHeight = 0.8*this.bgImg.height
    let cutPosX = (this.bgImg.width/2)-(cardWidth/2)
    let cutPosY = (this.bgImg.height/2)-(cardHeight/2)
    console.log(cutPosX, cutPosY)
    let radius = 50;
    let x = cutPosX;
    let y = cutPosY;
    let width = cardWidth;
    let height = cardHeight
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
    this.ctx.clip()

    
    this.ctx.drawImage(this.cardImg, cutPosX, cutPosY, cardWidth, cardHeight);
  }

  drawMark(){
    this.ctx.globalAlpha=0.4;
    this.ctx.fileStyle='#000000'
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    this.ctx.globalAlpha=1;
  }


  drawBlurBackgroundImage(){
    this.ctx.globalAlpha = 0.1;
    for ( let y = -BLUR_LEVEL; y<= BLUR_LEVEL; y++){
      for(let x= -BLUR_LEVEL; x<=BLUR_LEVEL; x++){
        this.ctx.drawImage(this.bgImg, x, y);
      }
    }
    this.ctx.globalAlpha = 1;
  }
}
const canvas = document.getElementById('game');
if (!canvas) {
  throw new Error('Canvas element not found');
}

const ctx = canvas.getContext('2d');

ctx.font         = '32px Arial';
ctx.textAlign    = 'center';
ctx.textBaseline = 'middle';
ctx.fillStyle    = 'white';

ctx.fillText('SPILL', canvas.width/2, canvas.height/2);

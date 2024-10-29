var c = document.getElementById("grensevakt");
var ctx = c.getContext("2d");

bakgrunn();


//Harry- avventer bilder av Harry
let x = 450;
let y = 340;
function tegnHarry() {
    
    ctx.fillRect(x, y, 50, 50);
    ctx.stroke();
}


//Jail
function bakgrunn() {
ctx.moveTo(250, 250);
ctx.lineTo(250, 500);
ctx.moveTo(230, 250);
ctx.lineTo(230, 500);
ctx.moveTo(210, 250);
ctx.lineTo(210, 500);
ctx.moveTo(190, 250);
ctx.lineTo(190, 500);
ctx.moveTo(170, 250);
ctx.lineTo(170, 500);
ctx.moveTo(150, 250);
ctx.lineTo(150, 500);
ctx.moveTo(130, 250);
ctx.lineTo(130, 500);
ctx.moveTo(110, 250);
ctx.lineTo(110, 500);
ctx.moveTo(90, 250);
ctx.lineTo(90, 500);
ctx.moveTo(70, 250);
ctx.lineTo(70, 500);
ctx.moveTo(50, 250);
ctx.lineTo(50, 500);
ctx.moveTo(30, 250);
ctx.lineTo(30, 500);
ctx.moveTo(10, 250);
ctx.lineTo(10, 500);
ctx.stroke();
ctx.font="40px italic";
ctx.fillStyle = "black"
ctx.fillText("Kasjotten",50, 200);



//Solnedgang
ctx.fillText("Solnedgangen",760, 200);
ctx.fillStyle = "lightblue";
ctx.fillRect(750, 250, 250, 100);
ctx.fillStyle = "green";
ctx.fillRect(750, 350, 250, 150);
ctx.fillStyle = "yellow";
ctx.moveTo(870, 500);
ctx.lineTo(870, 350);
ctx.stroke();

ctx.fillStyle = "grey";
ctx.beginPath();
ctx.moveTo(770, 500);
ctx.lineTo(850, 350)
ctx.lineTo(890, 350);
ctx.lineTo(970, 500);
ctx.closePath();
ctx.fill();
ctx.stroke();

ctx.fillStyle = "red";
ctx.beginPath();
ctx.arc(870, 250, 40, 0, 1 * Math.PI );
ctx.fill();
ctx.stroke();


ctx.font="25px italic";
ctx.fillStyle = "black";
ctx.fillText("Du nærmer deg grensa og må ta et valg...", 10, 30);
ctx.fillText("1) Du kan velge tollen der du mister 25% av poengene....eller",10, 60 )
ctx.fillText("2) Du kan krysse grensa og beholde alt.. eller havne i kasjotten",10, 80)

}

// Her kommer en funksjon som fjerner 25% av poengsum ved å velge "toll.knappen"



//sistebilde
function last_pic() {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 150, 1000, 350);
    ctx.stroke();
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, 1000, 150);
    ctx.fillStyle = "grey";
    ctx.beginPath(50, 500);
    ctx.lineTo(125, 150);
    ctx.lineTo(175, 150);
    ctx.lineTo(250, 500);
    ctx.lineTo(50, 500);
    ctx.fill();
    ctx.fillStyle ="yellow"
    ctx.fillRect(500, 75, 250, 200);
    ctx.stroke();
    ctx.strokeStyle = "black"
    ctx.moveTo(500, 275);
    ctx.lineTo(500, 400);
    ctx.moveTo(750, 275);
    ctx.lineTo(750, 400);
    ctx.fillStyle = "black";
    ctx.font="40px italic";
    ctx.fillText("Norge", 570, 180);
    ctx.stroke();
    ctx.moveTo(500, 75);
    ctx.lineTo(625, 75);
    ctx.lineTo(500, 125);
    ctx.lineTo(500, 75)
    ctx.fill();
    ctx.moveTo(750, 75);
    ctx.lineTo(625, 75);
    ctx.lineTo(750, 125);
    ctx.lineTo(750, 75);
    ctx.fill();
    }

    //Figur beveger seg inn i solnedgangen
function Bevegelse_sol() {
    const interval = setInterval(() => {
        if (x >= 900) {
            clearInterval(interval);
            
        } else {
            ctx.clearRect(x, y, 50, 50);
            x++; 
            tegnHarry();
            bakgrunn();
        }
        
    }, 10); 
}
number = Math.floor((Math.random() *10) + 1); // 40% sjanse for å havne i kasjotten, 60% for å slippe unna
function kasj_sol() {
    
    if (number < 4) {
        Bevegelse_kasj();
    } else {
        Bevegelse_sol();
        myFunction();
        
        
    }

}




let timeout;

function myFunction() {
    ctx.clearRect(0, 0, 1000, 500);
    timeout = setTimeout(last_pic, 5000);
}

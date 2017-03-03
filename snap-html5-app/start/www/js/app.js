var UI = new UbuntuUI();

var canvas;
var context;
var isWhite = true;//设置是否该轮到白棋
var isWell = false;//设置该局棋盘是否赢了，如果赢了就不能再走了
var img_b = new Image();
img_b.src = "images/b.png";//白棋图片
var img_w = new Image();
img_w.src = "images/w.png";//黑棋图片
var rect;

var chessData = new Array(16);//这个为棋盘的二维数组用来保存棋盘信息，初始化0为没有走过的，1为白棋走的，2为黑棋走的
for (var x = 0; x < 16; x++) {
    chessData[x] = new Array(16);
    for (var y = 0; y < 16; y++) {
        chessData[x][y] = 0;
    }
}

window.onload = function () {
    UI.init();

    init();

    document.getElementById('start').addEventListener('click', function() {
        console.log("Start is clicked!");
        init();
    });
}

function init() {
    isWhite = true; //设置是否该轮到白棋
    isWell = false; //设置该局棋盘是否赢了，如果赢了就不能再走了
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    console.log("init data...!");

    // we must clear the data as well
    for ( var i = 0; i < 16; i ++ ) {
        for ( var j = 0; j < 16; j ++ ) {
            chessData[i][j] = 0;
        }
    }

    for (var i = 0; i <= 640; i += 40) {//绘制棋盘的线
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(640, i);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, 640);
        context.closePath();
        context.stroke();
    }
}

function findPositionX(obj)
{
    var left = 0;
    if(obj.offsetParent)
    {
        while(1)
        {
            left += obj.offsetLeft;
            if(!obj.offsetParent)
                break;
            obj = obj.offsetParent;
        }
    }
    else if(obj.x)
    {
        left += obj.x;
    }
    return left;
}

function findPositionY(obj)
{
    var top = 0;
    if(obj.offsetParent)
    {
        while(1)
        {
            top += obj.offsetTop;
            if(!obj.offsetParent)
                break;
            obj = obj.offsetParent;
        }
    }
    else if(obj.y)
    {
        top += obj.y;
    }
    return top;
}

function play(e) {//鼠标点击时发生

    console.log("(" + e.clientX +", " + e.clientY+")");

    rect = document.getElementById("canvas").getBoundingClientRect();
    var canvas = document.getElementById("canvas");

//    console.log(rect.left, rect.top,  rect.right, rect.bottom );
//    console.log(findPositionX(canvas), findPositionY(canvas));
//    console.log("width:" + rect.width + " height: " + rect.height);

    var x = parseInt((e.clientX - rect.left - 20) / 40);//计算鼠标点击的区域，如果点击了（65，65），那么就是点击了（1，1）的位置
    var y = parseInt((e.clientY - rect.top - 20) / 40);

    console.log("new x: " + x + " new y: " + y );

    if ( (!(x >= 0 && x <= 15)) || !(y>=0 && y<=15))
        return;

    if (chessData[x][y] !== 0) {//判断该位置是否被下过了
        alert("你不能在这个位置下棋");
        return;
    }

    if (isWhite) {
        isWhite = false;

        drawChess(1, x, y);
    }
    else {
        isWhite = true;
        drawChess(2, x, y);
    }

    updateTurnStatus();
}

function updateTurnStatus() {
    var chess = document.getElementById('chess');

    if ( isWhite ) {
        chess.setAttribute("src", "images/w.png");
    } else {
        chess.setAttribute("src", "images/b.png");
    }
}


function drawChess(chess, x, y) { //参数为，棋（1为白棋，2为黑棋），数组位置
    if (isWell == true) {
        messageBox("Game Over", "如果需要重新玩，请刷新");
        return;
    }

    if ((x >= 0 && x <= 15) && (y >= 0 && y <= 15)) {
        if (chess === 1) {
            //            console.log("y1: " + y1 + " top: " + rect.top );
            context.drawImage(img_w, x * 40 + 20,   y  * 40 + 20);//绘制白棋
            chessData[x][y] = 1;
        }
        else {
            context.drawImage(img_b, x * 40 + 20,  y * 40 + 20);
            chessData[x][y] = 2;
        }

        judge(x, y, chess);
    }
}
function judge(x, y, chess) {//判断该局棋盘是否赢了
    console.log("judge: " + x + " " + y + " " + chess);
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;

    //左右判断
    for (var i = x; i >= 0; i--) {
        if (chessData[i][y] !== chess) {
            break;
        }
        count1++;
    }
    for (var i = x + 1; i <= 15; i++) {
        if (chessData[i][y] !== chess) {
            break;
        }
        count1++;
    }
    //上下判断
    for (var i = y; i >= 0; i--) {
        if (chessData[x][i] !== chess) {
            break;
        }
        count2++;
    }
    for (var i = y + 1; i <= 15; i++) {
        if (chessData[x][i] !== chess) {
            break;
        }
        count2++;
    }
    //左上右下判断
    for (var i = x, j = y; i >= 0 && j >= 0; i--, j--) {
        if (chessData[i][j] !== chess) {
            break;
        }
        count3++;
    }

    for (var i = x + 1, j = y + 1; i <= 15 && j <= 15; i++, j++) {
        if (chessData[i][j] !== chess) {
            break;
        }
        count3++;
    }
    //右上左下判断
    console.log("x: " + x + " y: " + y);
    for (var i = x, j = y; i >= 0 && j <= 15; i--, j++) {
        console.log("i: " + i + " j: " + j );

        if (chessData[i][j] !== chess) {
            break;
        }
        count4++;
    }
    for (var i = x + 1, j = y - 1; i <= 15 && j >= 0; i++, j--) {
        if (chessData[i][j] !== chess) {
            break;
        }
        count4++;
    }

    if (count1 >= 5 || count2 >= 5 || count3 >= 5 || count4 >= 5) {
        if (chess === 1) {
            messageBox("白棋赢了");
        }
        else {
            messageBox("黑棋赢了");
        }

        isWell = true;//设置该局棋盘已经赢了，不可以再走了
    }
}

function alertDismissed(err) {
    console.log("alert: " + err.message);
}

function messageBox(title, msg) {
//    try {
//        navigator.notification.alert(
//                    msg,  // message
//                    alertDismissed,         // callback
//                    title,            // title
//                    'OK'                  // buttonName
//                    );
//    } catch(err) {
//        console.log("err: " + err.message);
//    }
}

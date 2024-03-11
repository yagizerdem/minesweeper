var squares = [];
var matrix = [];
var center;
var gamecounter = 0;
var mineCount;
window.onload = () => {
  createSquares();
  center = document.getElementById("center");
  main();
};

function main() {
  for (var div of squares) {
    center.innerHTML += div;
  }
}

function createSquares() {
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      var div = `<div class='card' x=${j} y=${i} onclick="clickHandler(${i},${j})" }>
            <div class='front'>

                <i class="fa-solid fa-question"></i>
            </div>
            <div class='back'> </div>
            </div>`;
      squares.push(div);
    }
  }
}
function clickHandler(row, col) {
  if (matrix.length == 0) {
    createMatrix(row * 1, col * 1);
    printBack();
  }
  var index = 10 * col + row;
  const elements = document.querySelectorAll(`[x='${col}'][y='${row}']`)[0];

  matrix[row][col].isOpened = true

  elements.children[0].classList.add("animate");
  elements.children[1].classList.add("animate2");

  elements.removeAttribute("onclick");
  squares.splice(index, 1);

  // check death
  if (matrix[row][col].data == "!") screen("game over", "death");


  // recursive open
  if (matrix[row][col].data == 0) {
    openrecursive(row, col);
  } else gamecounter++;
  matrix[row][col].isOpened = true;

  if (gamecounter == 100 - mineCount) {
    // win
    screen("game over", "you win");
  }
  console.log(gamecounter , 100 - mineCount)
}
function createMatrix(r_, c_) {
  for (var i = 0; i < 10; i++) {
    var row = [];
    for (var j = 0; j < 10; j++) {
      row.push(0);
    }
    matrix.push(row);
  }
  var obj = {};
  mineCount = Math.floor(Math.random() * 10) + 20;
//   mineCount = 1; // test case

  while (Object.keys(obj).length < mineCount) {
    var r = Math.floor(Math.random() * 10);
    var c = Math.floor(Math.random() * 10);
    if (c == c_ && r == r_) continue;

    if (obj[r + c * 10] != undefined) continue;
    obj[r + c * 10] = "!";
    matrix[r][c] = { isOpened: false, data: "!" };
  }
  // calc mines
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      if (matrix[i][j].data == "!") continue;
      var counter = 0;
      for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
          if (
            i + y >= 0 &&
            j + x >= 0 &&
            j + x < 10 &&
            i + y < 10 &&
            matrix[i + y][j + x].data == "!"
          ) {
            counter++;
          }
        }
      }
      matrix[i][j] = { isOpened: false, data: counter };
    }
  }
}
function printBack() {
  const elements = document.querySelectorAll(".card");
  elements.forEach((item) => {
    const x = item.getAttribute("x") * 1;
    const y = item.getAttribute("y") * 1;

    var colors = ["red", "blue", "green"];
    item.children[1].innerHTML =
      matrix[y][x].data != "!"
        ? `<span class="value" style='color:${
            colors[Math.floor(colors.length * Math.random())]
          }'>${matrix[y][x].data}</span>`
        : `<img src='./mine.png'/>`;
  });
}
function screen(title, msg) {
  var sceen = `
        <div class='screen'>
            <span class='title'>${title}</span>
            </br>
            <span class='msg'>${msg}</span>
            <button class="playagain" onclick='again()'> play again </button>
        </div>
    `;

  const body = document.querySelector("body");
  body.innerHTML += sceen;

  console.log(title, msg);
}
function again() {
  location.reload();
}
function openrecursive(row, col) {
  var initialrow = row;
  var initialcol = col;
  function helper(row, col) {
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        if (row +i < 0 || col + j < 0 || row  +i > 9 || col + j > 9) continue;

        if (matrix[row][col].data == 0) {
          const elements = document.querySelectorAll(
            `[x='${col}'][y='${row}']`
          )[0];

          var index = 10 * row + col ;

          elements.children[0].classList.add("animate");
          elements.children[1].classList.add("animate2");


          elements.removeAttribute("onclick");
          squares.splice(index, 1);
          if(!matrix[row][col].isOpened) gamecounter++;
          matrix[row][col].isOpened = true

          if (
            !matrix[row +i][col+j].isOpened
          ) helper(row + i, col + j);
        }
      }
    }
  }
  helper(row, col, 0);
}

//main node array
A = [2]; //1
B = [3, 6]; //2
C = [4]; //3
D = [5]; //4
E = [0]; //5
F = [7]; //6
G = [8]; //7
H = []; //8
let nodeSetup = [A, B, C, D, E, F, G, H];
let nodeCount = nodeSetup.length;

let complete_nodes = [];
let nodeWeights = [];
let ADJACENCY_MATRIX = [];

fillZero(complete_nodes, nodeCount);
fillZero(nodeWeights, nodeCount);
fillZero(ADJACENCY_MATRIX, nodeCount);

//fills each node until their sizes are equal to nodeCount
for(i = 0; i < nodeCount; i++) {
  while(nodeSetup[i].length < nodeCount) {
    nodeSetup[i].push(0);
  }
};

//adjacency list
for(i = 0; i < nodeCount; i++) {
  for(j = 0; j < nodeCount; j++) {
    k = nodeSetup[i][j]
    if(k != 0) {
      complete_nodes[i][k - 1] = k
      complete_nodes[k - 1][i] = i + 1;
    }
  }
}
/*
node to node distance
A to B has a distance equal to B to A
*/
//distance between each nodeSetup
nodeWeights[0][1] = 1

nodeWeights[1][2] = 8
nodeWeights[2][3] = 2
nodeWeights[3][4] = 3

nodeWeights[1][5] = 5
nodeWeights[5][6] = 10
nodeWeights[6][7] = 12

nodeFlip(nodeWeights);
diagonalBubbleSort(nodeWeights);
nodeFlip(nodeWeights);
createAdjacencyMatrix(complete_nodes);
let noNodes = nodeSetup.length;
let noConn = 0;

let nodes = []; //array that stores each node info : position and node size
let nodeCon = []; // array that each sub array store 2 connected nodes and line length
let startDisMultiplier = 0.3;
let forceConstant = 3000;
let gravityConstant = 0;

//calculating number of connection
for(i = 0; i < noNodes; i++) {
  for(j = i + 1; j < noNodes; j++) {
    if(ADJACENCY_MATRIX[i][j] != 0 && ADJACENCY_MATRIX[i][j] == ADJACENCY_MATRIX[j][i]) {
      noConn += 1;
    }
  } 
}

function setup() {
  canvasScale = 70
  createCanvas(16 * canvasScale, 9 * canvasScale);

  font_size = 21;
  textSize(font_size)

  circleDiameter = 8;

  weightDistance = 50

  for(let i = 0; i < noNodes; i++) {
    let x = random(-startDisMultiplier * width, startDisMultiplier * width)
    let y = random(-startDisMultiplier * height, startDisMultiplier * height)
    node = new Node(createVector(x, y), circleDiameter, i + 1)
    nodes.push(node);
  }

  for(let i = 0; i < noConn; i++) {
    for(let j = 1; j < noConn + 1; j++) {
      if(ADJACENCY_MATRIX[i][j] == 1 && ADJACENCY_MATRIX[i][j] == ADJACENCY_MATRIX[j][i]) {
        nodeCon.push([complete_nodes[i][j] - 1, complete_nodes[j][i] - 1, nodeWeights[i][j] * weightDistance]);
      }
    }
  }
}

function draw() {
  translate(width / 2, height / 2);
  background(231, 231, 231);

  nodeCon.forEach(con => {
    node1 = nodes[con[0]]
    node2 = nodes[con[1]]
    line(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y)
    
    //find midpoint of a line using result of 2 vector added together and then divived by 2
    weight = con[2] / weightDistance
    text(weight, (node1.pos.copy().add(node2.pos)).div(2).x, (node1.pos.copy().add(node2.pos)).div(2).y)
  })

  applyForces(nodes)
  nodes.forEach(node => {
    node.draw()
    node.update()
    node.nameDisplay()
  })

}

//stolen function
function applyForces(nodes) {
  // apply force towards centre
  nodes.forEach(node => {
    gravity = node.pos.copy().mult(-1).mult(gravityConstant)
    node.force = gravity
  })

  // apply repulsive force between nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      pos = nodes[i].pos
      dir = nodes[j].pos.copy().sub(pos)
      force = dir.div(dir.mag() * dir.mag())
      force.mult(forceConstant)
      nodes[i].force.add(force.copy().mult(-1))
      nodes[j].force.add(force)
    }
  }

  // apply forces applied by connections
  nodeCon.forEach(con => {
    let node1 = nodes[con[0]]
    let node2 = nodes[con[1]]
    let maxDis = con[2]
    let dis = node1.pos.copy().sub(node2.pos)
    //diff = dis.mag() - maxDis
    node1.force.sub(dis)
    node2.force.add(dis)
  })
}

///stright up stolen function area
function Node(pos, size, nodeName) {
  this.pos = pos
  this.force = createVector(0, 0)
  this.mass = (2 * PI * size)/1.5
  this.name = nodeName
}

Node.prototype.update = function() {
  force = this.force.copy()
  vel = force.copy().div(this.mass)
  this.pos.add(vel)
}

Node.prototype.draw = function() {
  ellipse(this.pos.x, this.pos.y, this.mass, this.mass)
}

Node.prototype.nameDisplay = function() {
  textPosX = this.pos.x - (font_size / 3)
  textPosY = this.pos.y + (font_size / 3)
  text(`${this.name}`, textPosX, textPosY)
}

function fillZero(arr, len) {
  for(i = 0; i < len; i++) {
    arr[i] = [];
    while(arr[i].length < len) {
      arr[i].push(0);
    }
  };
  return arr
}

function createAdjacencyMatrix(nodeArr) {
  for(i = 0; i < nodeArr.length; i++) {
    for(j = 0; j < nodeArr.length; j++) {
      k = nodeArr[j][i];
      if(nodeArr[i][j] != 0 && nodeArr[i][j] ==  k + j - i) {
        ADJACENCY_MATRIX[i][j] = 1;
        ADJACENCY_MATRIX[j][i] = 1;
      }
    }
  }
}

function nodeFlip(arr) {
  for(i = 0; i < arr.length; i++) {
    for(j = 0; j < arr.length; j++) {
      arr[j][i] = arr[i][j];
    }
  }
  return arr;
}

function diagonalBubbleSort(arr) {
  for (n = 0; n < nodeCount - 2; n++) {
    for (i = 0; i < nodeCount - 1; i++) {
      k = 1;
      for (j = i + n; j < nodeCount - 1; j++) {
        if (arr[i][j] != 0 && arr[i + k][j + k] != 0 && arr[i][j] > arr[i + k][j + k]) {
          const temp = arr[i + k][j + k];
          arr[i + k][j + k] = arr[i][j];
          arr[i][j] = temp;
        } else { k += 1}
      }
    }
  }
  return arr;
}

/*/
//debug area
console.log("noNodes : ", noNodes);
console.log("noConn : ", noConn);
console.log("nodes : ", nodes);
console.log("nodeCon: ", nodeCon);

console.log("nodeSetup : ", nodeSetup)
console.log("complete_nodes : ", complete_nodes)
console.log("ADJACENCY_MATRIX : ", ADJACENCY_MATRIX)
console.log("nodeWeights : ", nodeWeights)
/*/
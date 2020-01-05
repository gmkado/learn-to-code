const maze = document.querySelector('.maze');

// TODO: load the maze from file
// 0 = wall
// 1 = path
// 2 = start
// 3 = end
easyMaze = [
    [0,0,0,0,0],
    [2,1,1,1,3],
    [0,0,0,0,0]
];

easyMaze.forEach((row)=>{
    row.forEach((cell)=>{
        var cellSpan = document.createElement('span');
        switch(cell){
            case 0: 
                cellSpan.className = 'wall';
                break;
            case 1:
                cellSpan.className = 'path';
                break;
        }
        maze.appendChild(cellSpan);
    });
    var br = document.createElement('br');
    maze.appendChild(br);
})
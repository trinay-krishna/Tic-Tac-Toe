const gameBoard=(function (){
    console.log("Starting Game!");
    let gameboard=["","","","","","","","",""];

    function addMarkerToBoard(player,index){
        if(gameboard[index]!=="" || index===-1)
            return;
        gameboard[index]=player.marker;
        player.gameMap[index%3]+=1;
        Winner.checkWinner(player)
    }
    return {gameboard,addMarkerToBoard};
    
})();

const Winner=(function (){
    let gameFinishFlag=0;
    const gameboard=gameBoard.gameboard;
    function isRowFilled(marker,rowStart){
        let count=0;
        for(let i=rowStart;i<rowStart+3;i++){
            if(gameboard[i]===marker)
                count++;
        }
        return(count===3);
    }

    function isDiagonalFilled(marker){
        if((marker!=gameboard[0] && marker!=gameboard[2]) || marker!=gameboard[4])
            return false;
        return(marker===gameboard[6] || marker===gameboard[8]);
    }

    function declareWinner(marker){
        if(!gameFinishFlag){
            console.log(`${marker} HAS WON!`);
            gameFinishFlag=1;
        }
        
    }

    function checkWinner(player){
        const marker=player.marker;
        if(player.gameMap.includes(3)){
            declareWinner(marker);
            return;
        }
        if(player.gameMap.includes(0))
            return;
        if(isDiagonalFilled(marker)){
            declareWinner(marker);
            return;
        }
        let hasWon=false;
        for(let i=0;i<9;i+=3)
            hasWon=hasWon || isRowFilled(marker,i);
        if(hasWon)
            declareWinner(marker);
    }

    return {gameFinishFlag,checkWinner};
})(); 

const playerInteraction=(function(){
    const gameboard=gameBoard.gameboard;
    const gameBoardDOM=document.querySelector('.gameboard');
    //Setting up Players.   
    const player1={
        marker: "X",
        gameMap: [0,0,0]
    };
    const player2={
        marker: "O",
        gameMap: [0,0,0]
    };
    gameBoardDOM.addEventListener('click',addMarker);

    function getClickedIndex(event){
        const id=event.target.id;
        const index=(id.charAt(0)==="i")?+id.charAt(1):-1;
        if(index!==-1){
            if(gameboard[index]!=="")
                return -1;
        }
        return index;
    }

    function getComputerChoice(playerChoice){
        let computerChoice;
        if(playerChoice===-1 || !gameboard.includes(""))
            return -1;
        do{
            computerChoice=Math.floor(Math.random()*9);
        }while(gameboard[computerChoice]!=="");
        return computerChoice;

    }

    function placeMarkerDOM(playerChoice,computerChoice){
        if(playerChoice===-1)
            return;
        const playerBox=document.querySelector(`#i${playerChoice}`);
        playerBox.textContent=player1.marker;
        playerBox.classList.add("mark");
        if(computerChoice==-1)
            return;
        const computerBox=document.querySelector(`#i${computerChoice}`);
        computerBox.textContent=player2.marker;
        computerBox.classList.add("mark");
    }

    function addMarker(event){
        console.log(Winner.gameFinishFlag)
        if(Winner.gameFinishFlag)
            return;
        const playerChoice=getClickedIndex(event);
        gameBoard.addMarkerToBoard(player1,playerChoice);
        const computerChoice=getComputerChoice(playerChoice);
        gameBoard.addMarkerToBoard(player2,computerChoice);
        placeMarkerDOM(playerChoice,computerChoice);
    }
})()



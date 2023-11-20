(function(){

    const DOMManipulation=(function(){

        function placeMarkerDOM(player,index){
            const box=document.querySelector(`#i${index}`);
            box.textContent=player.marker;
        }

        function setWinnerDOM(winner){
            const winnerElement=document.querySelector('.main-container + p');
            if(winner)
                winnerElement.textContent=`${winner} HAS WON!`;
            else
                winnerElement.textContent=`ITS A TIE!`;
        }

        function clearGameBoard(){
            const winnerElement=document.querySelector('.main-container + p');
            winnerElement.textContent="";

            const boxes=document.querySelectorAll('.box');
            boxes.forEach(
                (box)=>{
                    box.textContent="";
                }
            )

        }
        return {placeMarkerDOM,setWinnerDOM,clearGameBoard}
    })();
    const gameBoard=(function (){
        let gameboard=["","","","","","","","",""];
        function addMarkerToBoard(player,index){
            if(gameboard[index]!=="" || index===-1)
                return;
            gameboard[index]=player.marker;
            player.gameMap[index%3]+=1;
            Winner.checkWinner(player)
        }

        function getGameBoard(){
            return gameboard;
        }

        function resetGameBoard(){
            gameboard=["","","","","","","","",""];
        }

        return {resetGameBoard,getGameBoard,addMarkerToBoard};
        
    })();

    const Winner=(function (){
        let gameFinishFlag=0;
        function isRowFilled(marker,rowStart){
            const gameboard=gameBoard.getGameBoard();
            let count=0;
            for(let i=rowStart;i<rowStart+3;i++){
                if(gameboard[i]===marker)
                    count++;
            }
            return(count===3);
        }

        function isDiagonalFilled(marker){
            const gameboard=gameBoard.getGameBoard();
            if((marker!=gameboard[0] && marker!=gameboard[2]) || marker!=gameboard[4])
                return false;
            return((marker===gameboard[6] && marker===gameboard[2]) || (marker===gameboard[0]&& marker===gameboard[8]));
        }

        function declareWinner(marker){
            if(!gameFinishFlag){
                DOMManipulation.setWinnerDOM(marker);
                gameFinishFlag=1;
            }
            
        }

        function checkWinner(player){
            const marker=player.marker;
            const gameboard=gameBoard.getGameBoard();
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
            if(hasWon){
                declareWinner(marker);
                return;
            }
            if(!gameboard.includes(""))
                DOMManipulation.setWinnerDOM(null);
        }

        function getGameFlag(){
            return gameFinishFlag;
        }
        
        function toggleGameFlag(){
            gameFinishFlag=0;
        }

        return {toggleGameFlag,getGameFlag,checkWinner};
    })(); 

    const playerInteraction=(function(){
        const gameBoardDOM=document.querySelector('.gameboard');
        const resetBtnDOM=document.querySelector('.reset');
        //Setting up Players.
        let player1,player2;   
        setPlayerMaps();
        gameBoardDOM.addEventListener('click',addMarker);
        resetBtnDOM.addEventListener('click',resetBtnClick);

        function resetBtnClick(){
            DOMManipulation.clearGameBoard();
            Winner.toggleGameFlag();
            gameBoard.resetGameBoard();
            setPlayerMaps();
        }

        function setPlayerMaps(){
            player1={
                marker: "X",
                gameMap: [0,0,0]
            };
            player2={
                marker: "O",
                gameMap: [0,0,0]
            };
        }

        function getClickedIndex(event){
            const gameboard=gameBoard.getGameBoard();
            const id=event.target.id;
            const index=(id.charAt(0)==="i")?+id.charAt(1):-1;
            if(index!==-1){
                if(gameboard[index]!=="")
                    return -1;
            }
            return index;
        }

        function getComputerChoice(playerChoice){
            const gameboard=gameBoard.getGameBoard();
            let computerChoice;
            if(playerChoice===-1 || !gameboard.includes("") || Winner.getGameFlag())
                return -1;
            do{
                computerChoice=Math.floor(Math.random()*9);
            }while(gameboard[computerChoice]!=="");
            return computerChoice;

        }

        function placeMarker(playerChoice,computerChoice){
            if(playerChoice===-1)
                return;
            DOMManipulation.placeMarkerDOM(player1,playerChoice);
            if(computerChoice==-1)
                return;
            DOMManipulation.placeMarkerDOM(player2,computerChoice);
        }

        function addMarker(event){
            if(Winner.getGameFlag())
                return;
            const playerChoice=getClickedIndex(event);
            gameBoard.addMarkerToBoard(player1,playerChoice);
            const computerChoice=getComputerChoice(playerChoice);
            gameBoard.addMarkerToBoard(player2,computerChoice);
            placeMarker(playerChoice,computerChoice);
        }
    })()
})();

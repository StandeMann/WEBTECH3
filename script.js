const teacherList = ["img/Arnold.jpeg","img/Bart.jpeg", "img/Cata.jpeg", "img/Cobi.jpeg", "img/Erik.jpeg", "img/Ilse.jpeg", "img/Jacob.jpeg", "img/Jolanda.jpeg", "img/Kobus.jpeg", "img/Marjon.jpeg", "img/Mark.jpeg", "img/Misja.jpeg", "img/Oscar.jpeg", "img/Patrick.jpeg", "img/Ralf.jpeg", "img/Renee.jpeg", "img/Silvia.jpeg", "img/Simon.jpeg" ]
const cards = document.querySelectorAll('.card');
console.log(cards)
const board = []
let cardlist = []

/**
 * A function to make an new object that stops the frames, so the user can look at the chosen card
 * @param  {[number]} msec The function takes as an argument how many miliseconds the page has to freeze.
 * @return {[Promise]}     The function returns the newly made object.
 */
async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}

/**
 * A function that uses the sleep function to freeze the screen.
 */
async function Sleep() {
    await sleep(1500);
}


/**
 * A class to make cards for the game to be played. When this class is called it makes a new card. 
 * @param  {[number]} Card_id The unique card_id for the, used to pair the cards together.
 * @param  {[number]} Board_Place The place on the board for the used card.
 * @return {[Card]} The function returns the newly made Card object.
 */
const CardGenerator = class Card{
    constructor(Card_id, Board_Place){
        this.Card_id = Card_id 
        this.Flipped = false
        this.Found = false
        this.Board_Place = Board_Place
    }

    get getCard_id(){
        return this.Card_id;
    }

    get getFlipped(){
        return this.Flipped
    }

    get getBoard_Place(){
        return this.Board_Place
    }
    get getFound(){
        return this.Found
    }

    set setFlipped(isflipped){
        this.Flipped = isflipped;
    }

    set setCard_id(ID){
        this.Card_id = ID
    }

    set setFound(found){
        this.Found = found
    }

    set setBoard_Place(Board_Place){
        this.Board_Place = Board_Place
    }

};

const CardHolder = new CardGenerator(null,null)

async function LoremPicsum(){
    let image = await fetch('https://picsum.photos/200');
    return image.url;
}

async function DogAPI(){
    let image = await fetch('https://dog.ceo/api/breeds/image/random') 
    return image.url
}

async function CatAPI(){
    let image = (`https://cataas.com/${(await fetch('https://cataas.com/c?json=true&type=sq').then(res => res.json())).url}`) 
    return image
}

async function getCard(style){
    cardlist = []

    if (style == 'teachers') {
        teacherList.forEach(teacher => cardlist.push(teacher))
    }
    if (style == 'LoremPicsum') {
        for (let i = 0; i < cards.length; i++) {
            cardlist.push(await LoremPicsum());
        }
    }
    if (style == 'DogAPI') {
        for (let i = 0; i < cards.length; i++) {
            cardlist.push(await DogAPI());
        }
    }
    if (style == 'CatAPI') {
        for (let i = 0; i < cards.length; i++) {
            cardlist.push(await CatAPI());
        }
    }
    return cardlist
}


async function createBackboard(){
    for(let i = 0; i<cards.length;i++){ // Maken van het bord aan de achterkant van het spel.
        nextCard = new CardGenerator(document.getElementsByTagName("img")[i].id,i)
        board.push(nextCard)
    }
    for(let i = 0; i<board.length;i++){ // Toevoegen van listeners aan het bord aan de voorkant van het spel.
        console.log(board[i].getCard_id)
        document.getElementById(board[i].getCard_id).addEventListener('click', clickEvent);
    }
};

function clickEvent() {
    // #starttimer
    if (!document.getElementById(this.id).classList.contains('front-face')) return; 
    
    document.getElementById(this.id).src=cardlist[parseInt(this.id)-1];
    document.getElementById(this.id).className='back-face'
    FlipCard(board[this.id.split('.').reduce((a, b) => parseInt(a)*2 + parseInt(b) - 3)])
    changeCard_C();
    changeOpen_C();
    changeFound_C();  
    finished()
}

//Functies die kleuren veranderen.
function changeCard_C(){
    // console.log(document.getElementById("closed").value)
    elements = document.getElementsByClassName('front-face')
    for(let i = 0;elements.length > i;i++){
        elements[i].style.backgroundColor = document.getElementById("closed").value;
    }
};

function changeOpen_C(){
    // console.log(document.getElementById("open").value)
    elements = document.getElementsByClassName('back-face')
    for(let i = 0; elements.length > i;i++){
        elements[i].style.backgroundColor = document.getElementById("open").value;
    }
};

function changeFound_C(){
    // console.log(document.getElementById("found").value)
    elements = document.getElementsByClassName('found-face')
    for(let i = 0; elements.length > i;i++){
        elements[i].style.backgroundColor = document.getElementById("found").value;
    }
};

async function FlipCard(card){
    if(CardHolder.getFlipped == false){ //Eerste kaart is geflipped en wordt bewaard.
        card.setFlipped = true
        CardHolder.setCard_id = card.getCard_id
        CardHolder.setFlipped = card.getFlipped
        CardHolder.setBoard_Place = card.getBoard_Place

    }

    else if(CardHolder.getFlipped == true){
        console.log(CardHolder)
        console.log(card) 
        if (parseInt(CardHolder.getCard_id) == parseInt(card.getCard_id)){ // Kaarten zijn gelijk
            console.log("Gelijk")
            card.setFound = true
            board[CardHolder.getBoard_Place].setFound = true
            CardHolder.setFlipped = false
            document.getElementById(card.getCard_id).className='found-face'
            document.getElementById(board[CardHolder.getBoard_Place].getCard_id).className='found-face'
        }

        else if(parseInt(CardHolder.getCard_id) != parseInt(card.getCard_id)){ // Kaarten zijn niet gelijk
            console.log("Niet gelijk!")
            await sleep(3000)
            CardHolder.setFlipped = false
            document.getElementById(card.getCard_id).src = "img/Hanze.png"
            document.getElementById(CardHolder.getCard_id).src = "img/Hanze.png"
            card.setFlipped = false
            board[CardHolder.getBoard_Place].setFlipped = false
            document.getElementById(card.getCard_id).className='front-face'
            document.getElementById(CardHolder.getCard_id).className='front-face'
            changeCard_C();
        }
    }
};

async function finished(){
    for(let i = 0; cards.length>i;i++){
        if(board[i].getFound == false){
            return
        }
    }
    alert("Gefeliciteerd, je hebt ze allemaal!!!")
    Sleep()
    location.reload()
}

function shuffle() {
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * 12);
      card.style.order = randomPos;
    });
  }

  async function resetBackboard(){
    board.forEach(card => {
        card.setFlipped = false
        document.getElementById(card.getCard_id).removeEventListener('click', clickEvent)
        document.getElementById(card.getCard_id).src = "img/Hanze.png"
        document.getElementById(card.getCard_id).className='front-face'
    })

    cardlist = await getCard(document.getElementById('cardset').value)

    for(let i = 0; i<board.length;i++){
        document.getElementById(board[i].getCard_id).addEventListener('click', clickEvent);
    }

    shuffle()
}

getCard(document.getElementById('cardset').value)
createBackboard()
shuffle()
document.getElementById('cardset').addEventListener('change', resetBackboard)



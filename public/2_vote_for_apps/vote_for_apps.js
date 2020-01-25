let clientId;

document.addEventListener("DOMContentLoaded", function() {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  try {
    let app = firebase.app();
    
    // let features = ["firestore"].filter(
    //   feature => typeof app[feature] === "function"
    // );
    // document.getElementById(
    //   "load"
    // ).innerHTML = `Firebase SDK loaded with ${features.join(", ")}`;    
    
    // get the google analytics tracker so you can only vote once per session
    ga((tracker) => {
        clientId = tracker.get('clientId');
    });

    // load database
    var db = firebase.firestore();
    db.collection("appIdeas")
    .orderBy("netVotes", "desc")
      .onSnapshot(querySnapshot => {
        // clear existing idea cards
        let ideacards = document.getElementsByClassName('idea-card');
        while(ideacards[0]) {
            ideacards[0].parentNode.removeChild(ideacards[0]);
        }
        querySnapshot.forEach(doc => displayAppIdea(doc));
      });

    document.getElementById('addIdea').addEventListener('click', ()=>{
        let form = document.forms['myform']
        if(form.reportValidity()){
            db.collection('appIdeas').add({
                name: form.elements['name'].value,
                description: form.elements['description'].value,
                netVotes: 0,
                upvotes: [],
                downvotes:[]
            });
            
            // clear the input elements
            form.elements['name'].value='';
            form.elements['description'].value ='';
        }
    });
  } catch (e) {
    console.error(e);
    document.getElementById("load").innerHTML =
      "Error loading the Firebase SDK, check the console.";
  }
});

function displayAppIdea(doc) {
    let ideaTemplate = document.getElementsByTagName('template')[0];
    let ideaCard = ideaTemplate.content.cloneNode(true);
    
    let voteColumn = ideaCard.querySelector('.idea-card__voting')
    let contentColumn = ideaCard.querySelector('.idea-card__content')
    let upvoteBtn = voteColumn.querySelector('.idea-card__upvote')
    let downvoteBtn = voteColumn.querySelector('.idea-card__downvote')    
    let voteCount = voteColumn.querySelector('.idea-card__count')    

    // check if our list contains the current client id
    let upvoteList = doc.data().upvotes ||[];
    let downvoteList = doc.data().downvotes||[];
    if(upvoteList.includes(clientId)) {
        upvoteBtn.classList.toggle('idea-card__vote--on');
    }
    if(downvoteList.includes(clientId)) {
        downvoteBtn.classList.toggle('idea-card__vote--on');
    }    

    let clickhandler = (event, isUpvote) => {
        if(clientId) {
            voteList = isUpvote ? upvoteList : downvoteList;

            // see if this person already voted
            let indexOfClient = voteList.indexOf(clientId)
            if(indexOfClient > -1){
                voteList.splice(indexOfClient, 1)
            }else{
                voteList.push(clientId)
            }
            // update the document
            let updatedFields = isUpvote? {upvotes:voteList}:{downvotes:voteList};
            updatedFields.netVotes = upvoteList.length - downvoteList.length;

            doc.ref.update(updatedFields)
                .then(() => {
                    /// event.target.classList.toggle('on');    
                    console.log("Document successfully updated!");
                })
                .catch((error) => console.error("Error updating document: ", error));
        }else{
            alert('cannot vote yet');
        }
    };

    upvoteBtn.addEventListener('click', (event)=> clickhandler(event, true));
    downvoteBtn.addEventListener('click', (event)=> clickhandler(event, false));       
    voteCount.textContent = doc.data().netVotes||0;

    contentColumn.querySelector('#name').textContent = doc.data().name;
    contentColumn.querySelector('#description').textContent = doc.data().description;
    
    document.body.appendChild(ideaCard);
}
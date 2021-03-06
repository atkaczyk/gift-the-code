window.onload = function() {
  //on first click I sent "What's on your mind?"

  $(window).resize(function() {
    // This will fire each time the window is resized:
    if($(window).width() >= 800) {
        // if larger or equal
        $('#chat-history').addClass("chat-history");
        $('#chat-history').removeClass("chat-history-mobile");
      } else {
        // if smaller
        $('#chat-history').removeClass("chat-history");
        $('#chat-history').addClass("chat-history-mobile");

      }
    }).resize();

  $(init);
  function init(){
    var url = "http://kalbot-api.us-east-1.elasticbeanstalk.com/answer?response=";
    var query = "What's on your mind?"; //document.getElementById(this.id).
    $.get(url+query, function(data, status){
      console.log(data);
      console.log(data.options);
      let newButtons = data.options;
      $("#question-field").text(data.message);
      for(const index in newButtons){
        $("#button-"+index).text(newButtons[index].text);
        $("#button-"+index).data( "link", newButtons[index].link );
        console.log("link " + index + " --" + newButtons[index].link );
      }
    });
    console.log("*** Init function completed ***");
  }
  
  function updateScroll(){
    document.getElementById("chat-history").scrollTop = document.getElementById("chat-history").scrollHeight;
    //document.getElementById("chat-history-mobile").scrollTop = document.getElementById("chat-history-mobile").scrollHeight;
    $('html, body').scrollTop( $('body').height() );
  }
  $(document).ready(function(){
    $("button").click(function(){
      $("#chat-history").removeClass("hide"); // i only have to do this on the first click, but oh well.
      var url = "http://kalbot-api.us-east-1.elasticbeanstalk.com/answer?response=";
      var query =  $( "#"+this.id ).data( "link" );
      // console.log("SENDING THIS BACK TO REQUEST GET: "+query);
      // console.log(url+query);

      //log the previous question in the chat history as a smaller bubble.
      var prevQuestion = $( "#question-field" ).text();
      var $divQuestion = $("<p class='question archived'>" + prevQuestion + "</p>");
      $("#chat-history").append($divQuestion);

      //log the recent response in the chat history as a smaller bubble.
      var prevResponse = $( "#"+this.id ).text();
      var $divResponse = $("<p class='answer archived cell'>"+prevResponse + "</p>");
      console.log($divResponse);
      $("#chat-history").append($divResponse);

      //bring up the next question
      //if both are empty then display the message - send whats on your mind?
      $.get(url+query, function(data, status){
       console.log("Content returned from the server: " + data.options);
       console.log("Message returned from the server: " + data.message);
       let newButtons = data.options;
       let message = data.message;
       let urlKeywords = "http"; //every string with http
      //after noticing the text leaves are empty, we verify the message isn't a link
      if(message.includes(urlKeywords) || message.includes("kidshelphone.ca")){
        var win = window.open(message, '_blank');
        if (win) {
              //Browser has allowed it to be opened
              win.focus();
            } else {
              //Browser has blocked it
              alert('Please allow popups for this website');
            }
          //message = "<a href='"+message+"' target='_blank'>"+message+"</a>";
          //console.log("********* THIS IS A FUCKING URL" + message);
        }

        $("#question-field").text(message);
        let tempCounter = data.options.length;
        console.log("Number of options to display: --- " + tempCounter);
        if(tempCounter === 0||data.options === null || data.options ===[]){
          console.log("inhereee eogmgggg");
          for(let i = 0; i < 3; i++){
            $("#button-"+i).toggleClass("hide");
            tempCounter -=1;
            console.log(tempCounter + " Decreased COUNTER");

            if(tempCounter <= 0){
            //there's no buttons so display the default button and add a link to it 
            $("#button-0").text("I want to start a new conversation.");
            $("#button-0").data( "link", "What's on your mind?");   
            $("#button-0").toggleClass("hide");
            // $("#button-1").text("Continue to Kids Help Phone Website!");
            // $("#button-1").data( "link", "https://www.kidshelphone.ca");   
            // $("#button-1").toggleClass("hide");
          }
        }
      }
      console.log(data.options);
      for(const index in newButtons){
         //only make a button and display it when the text field has content
         console.log("---- INSIDE THE LOOP");
         console.log("newButtons[index].text" + newButtons[index].text);
         //array is null array is empty or 
         if(newButtons[index].text === "" || newButtons[index].text === undefined){
          
          console.log("---- INSIDE THE IF STATEMENT");
          //show talk about something else button.
          
        } else if(newButtons[index].link ===""||newButtons[index].link ===undefined) {
          console.log("******************** link is empty");
        } else {
          $("#button-"+index).removeClass("hide");
          $("#button-"+index).text(newButtons[index].text);
          $("#button-"+index).data( "link", newButtons[index].link);        
          //console.log("link " + index + " --" + newButtons[index].link);
          updateScroll(); 
        }
      }

      console.log("END --")
    });
    });
//if link contains https then send to that link

});

}


/***********************
TODO
- default text in the gray box or put the message in the actual textbox.
- read links with https and if they have it then send the user to the new page. --huge selling point -- drive directly to content
*/
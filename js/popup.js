        // this is the id of the form    
function makeTable() {
    var url = "walnutAction.php"    // the script where you handle the form input.
    , formData = $("#getTable").serialize();   // serializes the form's elements.
    $.ajax({
           type: "GET",
           url: url,
           data: formData 
    })
       .done (function(data){
           $("#response").text(data).css("color", "blue"); // show response from the php script.
          alert(data);                   
       })
       .fail (function(data) {
           $("#response").text(data).css("color", "gold");
           alert(data);
       });

//       return false;  avoid to execute the actual submit of the form.
};
       
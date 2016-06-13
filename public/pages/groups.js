$(function () {
  
  // Grab the template script
  var theTemplateScript = $("#mainTitle-template").html();
  
  // Compile the template
  var theTemplate = Handlebars.compile(theTemplateScript);

  // Define our data object
  var context={
    "title": "קבוצות"
  };

  // Pass our data to the template
  var theCompiledHtml = theTemplate(context);

  // Add the compiled html to the page
  $('wrapper').html(theCompiledHtml);
  
});
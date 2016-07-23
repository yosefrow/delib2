function renderTemplate (template, context, destination){
  var groupsPublicTmpl = $(template).html();
  var groupPublicHandl = Handlebars.compile(groupsPublicTmpl);
  var groupPublicHTML = groupPublicHandl(context);
  $(destination).html(groupPublicHTML);
}

function convertTemplateTxt (template, context, destination){
  var groupsPublicTmpl = template;
  var groupPublicHandl = Handlebars.compile(groupsPublicTmpl);
  var groupPublicHTML = groupPublicHandl(context);
  $(destination).html(groupPublicHTML);
}

function appendTemplate (template, context, destination){
  var groupsPublicTmpl = $(template).html();
  var groupPublicHandl = Handlebars.compile(groupsPublicTmpl);
  var groupPublicHTML = groupPublicHandl(context);
  $(destination).append(groupPublicHTML);
}

function prependTemplate (template, context, destination){
  var groupsPublicTmpl = $(template).html();
  var groupPublicHandl = Handlebars.compile(groupsPublicTmpl);
  var groupPublicHTML = groupPublicHandl(context);
  $(destination).prepend(groupPublicHTML);
}

function goHome(){
  $("#globalNotificationsSub").css("color", inactiveColor)
  showPublicGroups();
  renderTemplate("#LogoHeaderTitle-tmpl",{}, "#headerTitle");
}

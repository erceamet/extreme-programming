class NavBarHandler {
  constructor(tracDirectory) {
    this.tracDirectory = tracDirectory;
  }

  static createTicket(tracDirectory) {
    // Navigation Bar- Create Ticket
    document.getElementById("create-button").onclick = function () {
      let create = document.getElementById("createTix");
      create.style.display = "block";

      let text_about_title = "Create Ticket";
      let link =
        '"https://csee.essex.ac.uk/trac/' + tracDirectory + '/newticket"';
      let text_form =
        '<form id="formCreate" action=' +
        link +
        ' method="GET">\n' +
        '\t<label for="summary">Summary:</label>\n' +
        '  \t<input type="text" name="summary" required><br>\n' +
        '    <label for="description">Description:</label>\n' +
        '    <input type="text" name="description"><br>\n' +
        '    <label for="type">Type:</label>\n' +
        '    <select id="type" name="type">\n' +
        '      <option value="feature">feature</option>\n' +
        '      <option value="story">story</option>\n' +
        '      <option value="technical task">technical task</option>\n' +
        '      <option value="bug">bug</option>\n' +
        "    </select><br>\n" +
        '    <label for="priority">Priority:</label>\n' +
        '    <select id="priority" name="priority">\n' +
        '      <option value="***">***</option>\n' +
        '      <option value="**">**</option>\n' +
        '      <option value="*">*</option>\n' +
        "    </select><br>\n" +
        '    <label for="keywords">Keywords:</label>\n' +
        '    <input type="text" name="keywords"><br>\n' +
        '    <label for="cc">Cc:</label>\n' +
        '    <input type="text" name="cc"><br>\n' +
        "   \n" +
        '    <input type="radio" id="create" name="action" value="action_create">\n' +
        '  \t<label for="male">Create</label><br>\n' +
        '  \t<input type="radio" id="assign_to" name="action" value="create_and_assign">\n' +
        '    <label for="action_create_and_assign_reassign_owner">Assign to:</label>\n' +
        '    <input type="text" name="action_create_and_assign_reassign_owner"><br>\n' +
        "</form>";
      let text_about_madeBy =
        '<input type="button" value="Submit Form" onclick="submitForm()" />';
      document.getElementById("create-title").innerHTML = text_about_title;
      document.getElementById("create-description").innerHTML = text_form;
      document.getElementById("create-bottom").innerHTML = text_about_madeBy;

      let span = document.getElementById("create-close");
      span.onclick = function () {
        create.style.display = "none";
      };

      window.onclick = function (event) {
        if (event.target == create) create.style.display = "none";
      };
    };
  }

  static navBarInit(tracDirectory) {
    // Navigation Bar- About
    document.getElementById("about").onclick = function () {
      let navAbout = document.getElementById("navAbout");
      navAbout.style.display = "block";

      let text_about_title = "About XP Visualiser";
      let text_about_description =
        "From text-heavy ticket list to colourful sticky note board <br/ > Draggable sticky notes <br/ > Ordered by priority <br/ > Link between issues <br/ > Immediate response from server";
      let text_about_madeBy =
        "Made by: Ben, Dennis, Erce, Jino, Jacob, Klive, Mikesh, Spyridonas, Taylan, Yilin";
      document.getElementById("about-title").innerHTML = text_about_title;
      document.getElementById(
        "about-description"
      ).innerHTML = text_about_description;
      document.getElementById("about-bottom").innerHTML = text_about_madeBy;

      let span = document.getElementById("about-close");
      span.onclick = function () {
        navAbout.style.display = "none";
      };

      window.onclick = function (event) {
        if (event.target == navAbout) {
          navAbout.style.display = "none";
        }
      };
    };

    // Open project wiki on trac
    document.getElementById("project-wiki").onclick = function () {
      window.open("https://csee.essex.ac.uk/trac/" + tracDirectory + "/wiki/");
    };

    // Open timeline page on trac
    document.getElementById("timeline").onclick = function () {
      window.open(
        "https://csee.essex.ac.uk/trac/" + tracDirectory + "/timeline/"
      );
    };
  }
}

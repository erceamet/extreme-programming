'use strict';

const TRAC_DIRECTORY = "ce320-14";
let tickets = [];
let stickys = [];
let stage;
let stickyLayer;
let lineHandler;
let STICKY_SIZE = getStickySize(); //originally 180
const BUFFER_SPACE = 10; //adds some spacing between stickys
//starting positions for tickets based on priority
let highestRow;
let midRow;
let lowRow;

// variables used for site theming (function site theme(c))
const THEMES = [
  //index 0 == background, index 1 - 11 == status tickets (found in findAppropriateTicketColor()), 12 == line color, 13 == stickyTextColor, 14 == star color
  [
    "url('./resources/cork.jpeg')",
    "#FFFFFF",
    "#616A6B",
    "#45B39D",
    "#16A085",
    "#138D75",
    "#117A65",
    "#0B5345",
    "#00FF00",
    "#FD6A02",
    "#45B39D",
    "yellow",
    "#FFFFFF",
    "#000000",
    "#d4af37",
  ], // Default
  [
    "url('./resources/darkCork.jpg')",
    "#b0b0b0",
    "#755100",
    "#4e669c",
    "#52617f",
    "#d37e24",
    "#d5ca24",
    "#7cb003",
    "#0e910c",
    "#ee1616",
    "#851599",
    "yellow",
    "#ffffff",
    "#ffffff",
    "#f000ff",
  ], // Dark Mode
  [
    "black",
    "#002eff",
    "#737373",
    "#00ff8b",
    "#004367",
    "#00ffd8",
    "#ff8f00",
    "#559400",
    "#93ff00",
    "#ff0000",
    "#dcc500",
    "yellow",
    "#ff00cd",
    "#ffffff",
    "#ffe400",
  ], //High Contrast
  [
    "url('./resources/greyCork.jpg')",
    "#EEEEEE",
    "#cccccc",
    "#999999",
    "#666666",
    "#333333",
    "#000000",
    "#0C0E0C",
    "#191919",
    "#2D2D2D",
    "#3b444f",
    "yellow",
    "#FFFFFF",
    "#ffffff",
    "#221717",
  ] // Grayscale
];
let themepointer = 0;
let stickyTextcolour = THEMES[themepointer][13];
let starColour = THEMES[themepointer][14];

function getSmallerOfWidthAndHeight() {
  if (window.innerHeight >= window.innerWidth) return window.innerWidth;
  else return window.innerHeight;
}

function calcSpacing(n) {
  return n * (STICKY_SIZE + BUFFER_SPACE);
}

function resetSpacing() {
  highestRow = { x: 0, y: 0 };
  midRow = { x: 0, y: BUFFER_SPACE * 5 + calcSpacing(1) };
  lowRow = { x: 0, y: BUFFER_SPACE * 10 + calcSpacing(2) };
}

function drawBoard() {
  stage.width(window.innerWidth);
  stage.height(window.innerHeight);
  stickys = [];
  resetSpacing();
  stickyLayer.removeChildren();

  //changes the sizing of tickets and the font size
  tickets.forEach((ticket) => {
    //turns tickets into stickys
    addTicketToBoard(ticket);
  });

  lineHandler.makeLinesConnectingStickies(stickys); //makes the connections between tickets where needed

  stickys.forEach((stickyNote) => stickyLayer.add(stickyNote)); //adds each sticky to the layer
  stickyLayer.batchDraw();
}

function getTicketsFromServer() {
  const XP_SERVER_ADDRESS = "http://localhost:9772";
  let tickRequest = new XMLHttpRequest();

  tickRequest.onload = () => {
    tickets = JSON.parse(tickRequest.responseText);

    console.log(tickets);
    tickets = tickets.sort((a, b) => b.priority.length - a.priority.length);
    drawBoard();
  };
  tickRequest.open("GET", XP_SERVER_ADDRESS + "/getAllTickets");
  tickRequest.send();
}

function contextMenuInit() {
  let contextmenu = document.getElementById("menu");

  window.addEventListener("contextmenu", e => e.preventDefault());

  window.addEventListener("click", () => {
    // hide menu
    contextmenu.style.display = "none";
  });
}

function getStickySize() {
  return 0.15 * getSmallerOfWidthAndHeight();
}

function start() {
  colourLegend();

  let width = window.innerWidth;
  let height = window.innerHeight;

  stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height
  });

  contextMenuInit();
  NavBarHandler.navBarInit(TRAC_DIRECTORY);

  stickyLayer = new Konva.Layer();

  lineHandler = new LineHandler(THEMES[themepointer][12]);

  getTicketsFromServer();

  stage.add(lineHandler.lineLayer);
  stage.add(stickyLayer); //adds the layer to the stage

  window.addEventListener("resize", function () {
    STICKY_SIZE = getStickySize();

    drawBoard();
  });
}

function addTicketToBoard(ticket) {
  switch (ticket.priority) {
    case "*":
      if (lowRow.x + STICKY_SIZE > window.innerWidth) {
        lowRow.x = 0;
        lowRow.y += calcSpacing(1);
      }
      stickys.push(makeSticky(ticket, lowRow.x, lowRow.y));
      lowRow.x += calcSpacing(1);
      break;
    case "**":
      if (midRow.x + STICKY_SIZE > window.innerWidth) {
        midRow.x = 0;
        midRow.y += calcSpacing(1);
        lowRow.y += calcSpacing(1);
      }
      stickys.push(makeSticky(ticket, midRow.x, midRow.y));
      midRow.x += calcSpacing(1);
      break;
    case "***":
      if (highestRow.x + STICKY_SIZE > window.innerWidth) {
        highestRow.x = 0;
        highestRow.y += calcSpacing(1);
        midRow.y += calcSpacing(1);
        lowRow.y += calcSpacing(1);
      }
      stickys.push(makeSticky(ticket, highestRow.x, highestRow.y));
      highestRow.x += calcSpacing(1);

      break;
    default:
      console.error("Unknown priority value");
      break;
  }
}

function findAppropriateTicketColor(status) {
  const ALPHA_TAG = "E9"; //transparency setting for sticky colours
  let protoTicketColor = null;

  //states of a ticket are as follows:
  // UNRESOLVED, coded
  // coded and tested
  // coded and refactored
  // coded, tested and refactored
  // coded, tested, refactored and integrated
  // done done
  // fixed
  // wontfix
  switch (status) {
    case "":
      protoTicketColor = THEMES[themepointer][1];
      break;

    case "unresolved":
      protoTicketColor = THEMES[themepointer][2];
      break;

    case "coded":
      protoTicketColor = THEMES[themepointer][3];
      break;

    case "coded and tested":
      protoTicketColor = THEMES[themepointer][4];
      break;

    case "coded and refactored":
      protoTicketColor = THEMES[themepointer][5];
      break;

    case "coded, tested and refactored":
      protoTicketColor = THEMES[themepointer][6];
      break;

    case "coded, tested, refactored and integrated":
      protoTicketColor = THEMES[themepointer][7];
      break;

    case "done done":
      protoTicketColor = THEMES[themepointer][8];
      break;

    case "wontfix":
      protoTicketColor = THEMES[themepointer][9];
      break;

    case "fixed":
      protoTicketColor = THEMES[themepointer][10];
      break;

    default:
      console.error("Unknown Status");
      protoTicketColor = THEMES[themepointer][11];
      break;
  }

  return protoTicketColor + ALPHA_TAG;
}

function makeSticky(ticketData, posX, posY) {
  let ticketColor = findAppropriateTicketColor(ticketData.resolution);

  let stickyTicket = new Konva.Group({
    x: posX + BUFFER_SPACE,
    y: posY + BUFFER_SPACE,
    draggable: true
  });

  let starGroup = new Konva.Group({ x: 0, y: 0 });
  let starCount = 0;

  if (ticketData.priority.replace(/\*/g, '').length !== 0)
    //want the priority string to be only stars
    console.error("Unknown priority type");
  else
    //counts how many stars in the priority string
    [...ticketData.priority].forEach(char => char === "*" ? starCount++ : null);

  const STAR_OFFSET = 25;
  for (let count = 0; count < starCount; count++)
    starGroup.add(ShapeMaker.makeStar(count * -STAR_OFFSET));

  let rectShape = new Konva.Rect({
    width: STICKY_SIZE,
    height: STICKY_SIZE,
    fill: ticketColor
  });

  stickyTicket.on("mouseover", () => document.body.style.cursor = "move");

  stickyTicket.on("mouseout", () => document.body.style.cursor = "default");

  let openTicketTracPage = () => window.open(
    `https://csee.essex.ac.uk/trac/${TRAC_DIRECTORY}/ticket/${ticketData.id}`
  );

  stickyTicket.on("click", (e) => {
    if (e.evt.button == 0) {
      console.log(ticketData);
      // Get the modal
      let modal = document.getElementById("myModal");

      // Get the <span> element that closes the modal
      let span = document.getElementsByClassName("close")[0];

      // setting the title, description, issued by and assigned for
      document.getElementById("modal-title").innerHTML = ticketData.ticketName;
      if (ticketData.description === "") {
        document.getElementById("modal-description").innerHTML =
          "No Description Added";
      }
      else
        document.getElementById("modal-description").innerHTML = ticketData.description;

      document.getElementById("modal-issued-by").innerHTML =
        ticketData.ticketIssuer;
      document.getElementById("modal-assigned-to").innerHTML =
        ticketData.ticketOwner;

      // When the user clicks the button, open the modal

      modal.style.display = "block";

      // When the user clicks on <span> (x), close the modal
      span.onclick = () => modal.style.display = "none";

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = (event) => {
        if (event.target == modal)
          modal.style.display = "none";
      }

      // Open ticket trac page by button
      document.getElementById("modal-button").onclick = openTicketTracPage;
    }
  });

  stickyTicket.on("contextmenu", (e) => {
    e.evt.preventDefault();

    let menuElement = document.getElementById("menu");
    document.getElementById("open-ticket-in-trac-page").onclick = openTicketTracPage;

    menuElement.style.display = 'block';
    let containerRect = stage.container().getBoundingClientRect();
    menuElement.style.top =
      containerRect.top + stage.getPointerPosition().y + 4 + 'px';
    menuElement.style.left =
      containerRect.left + stage.getPointerPosition().x + 4 + 'px';
  });

  stickyTicket.add(rectShape);
  stickyTicket.add(starGroup);

  let ticketNumber = new Konva.Text({
    text: "#" + ticketData.id,
    fontSize: 0.011 * getSmallerOfWidthAndHeight(),
    fill: stickyTextcolour,
    width: STICKY_SIZE,
    align: "left",
    padding: 4
  });

  stickyTicket.add(ticketNumber);

  let titleText = new Konva.Text({
    text: ticketData.ticketName,
    fontSize: 0.023 * getSmallerOfWidthAndHeight(),
    fontStyle: "bold",
    fill: stickyTextcolour,
    width: STICKY_SIZE,
    height: STICKY_SIZE,
    verticalAlign: "middle",
    padding: 8,
    align: "center"
  });

  stickyTicket.add(titleText);

  if (!(ticketData.ticketOwner === "")) {
    let ticketBody = new Konva.Text({
      text: "Owned by:" + ticketData.ticketOwner,
      fontSize: 0.015 * getSmallerOfWidthAndHeight(),
      fill: "#000",
      width: STICKY_SIZE,
      height: STICKY_SIZE,
      verticalAlign: "bottom",
      align: "center",
      padding: 4
    });

    stickyTicket.add(ticketBody);
  }

  stickyTicket.ticketData = ticketData;

  return stickyTicket;
}

function submitForm() {
  document.getElementById("formCreate").submit();
}

function navBarResponsive() {
  var x = document.getElementById("navbar");
  if (x.className === "navbar")
    x.className += " responsive";
  else
    x.className = "navbar";
}

function siteTheme(c) {
  document.body.style.backgroundImage = "none";
  themepointer = c;
  document.body.style.backgroundImage = THEMES[themepointer][0];
  if (c === "2") //high contrast
    document.body.style.backgroundColor = THEMES[themepointer][0];

  lineHandler.LINE_COLOUR = THEMES[themepointer][12];
  stickyTextcolour = THEMES[themepointer][13];
  starColour = THEMES[themepointer][14];

  drawBoard();

  // document.getElementById("body").style.backgroundImage = "";
  /*if (x.className === "navbar") {
    x.className += " responsive";
  } else {
    x.className = "navbar";
  }
  */

  colourLegend();
}

function colourLegend() {
  document.getElementById("unresolved").style.backgroundColor = THEMES[themepointer][2];
  document.getElementById("coded").style.backgroundColor = THEMES[themepointer][3];
  document.getElementById("ct").style.backgroundColor = THEMES[themepointer][4];
  document.getElementById("cr").style.backgroundColor = THEMES[themepointer][5];
  document.getElementById("ctr").style.backgroundColor = THEMES[themepointer][6];
  document.getElementById("ctri").style.backgroundColor = THEMES[themepointer][7];
  document.getElementById("dd").style.backgroundColor = THEMES[themepointer][8];
  document.getElementById("fixed").style.backgroundColor = THEMES[themepointer][9];
  document.getElementById("wfix").style.backgroundColor = THEMES[themepointer][10];
}

window.onload = start;

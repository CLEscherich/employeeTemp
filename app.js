const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = [];
const idArray = [];
//creating the manager's info
function appMenu() {
  function createManager() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "managerName",
          message: "What is your manager's name?",
          validate: async input => {
            if (input === "") {
              return "Please enter a name.";
            }
            return true;
          }
        },
        {
          type: "input",
          name: "managerId",
          message: "What is their id?",
          validate: async input => {
            if (isNaN(input)) {
              return "Please enter a number";
            }
            return true;
          }
        },
        {
          type: "input",
          name: "managerEmail",
          message: "What is their email?",
          validate: async input => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
              return true;
            }
            return "Please enter a valid email address.";
          }
        },
        {
          type: "input",
          name: "managerOfficeNumber",
          message: "What is their office number?",
          validate: async input => {
            if (isNaN(input)) {
              return "Please enter a number";
            }
            return true;
          }
        }
      ])
      //adding the answers to the questions for the manager's questions
      .then(answers => {
        const manager = new Manager(
          answers.managerName,
          answers.managerId,
          answers.managerEmail,
          answers.managerOfficeNumber
        );
        teamMembers.push(manager);
        idArray.push(answers.managerId);
        createTeam();
      });
  }
  //creating a list for user to select the next new team member
  function createTeam() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "memberChoice",
          message: "Would you like to add another team member?",
          choices: ["Engineer", "Intern", "My team is full"]
        }
      ])
      .then(userChoice => {
        switch (userChoice.memberChoice) {
        case "Engineer":
          addEngineer();
          break;
        case "Intern":
          addIntern();
          break;
        default:
          buildTeam();
        }
      });
  }
  //adding the info for each new team member
  //new engineer info
  function addEngineer() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "engineerName",
          message: "Engineer's name?",
          validate: async input => {
            if (input === "") {
              return "Please enter a name.";
            }
            return true;
          }
        },
        {
          type: "input",
          name: "engineerId",
          message: "What is their id?",
          validate: answer => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              if (idArray.includes(answer)) {
                return "This ID is already taken. Please enter a different number.";
              }
              return true;
            }
          }
        },
        {
          type: "input",
          name: "engineerEmail",
          message: "What is their email?",
          validate: async input => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
              return true;
            }
            return "Please enter a valid email address.";
          }
        },
        {
          type: "input",
          name: "engineerGithub",
          message: "What is their GitHub username?",
          validate: answer => {
            if (answer !== "") {
              return true;
            }
            return "Please enter at least one character.";
          }
        }
      ])
      //adding the info for new engineer
      .then(answers => {
        const engineer = new Engineer(
          answers.engineerName,
          answers.engineerId,
          answers.engineerEmail,
          answers.engineerGithub
        );
        teamMembers.push(engineer);
        idArray.push(answers.engineerId);
        createTeam();
      });
  }
  //creating a new intern
  function addIntern() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "internName",
          message: "What is their name?",
          validate: async input => {
            if (input === "") {
              return "Please enter a name.";
            }
            return true;
          }
        },
        {
          type: "input",
          name: "internId",
          message: "What is their id?",
          validate: answer => {
            const pass = answer.match(/^[1-9]\d*$/);
            if (pass) {
              if (idArray.includes(answer)) {
                return "This ID is already taken. Please enter a different number.";
              }
              return true;
            }
            return "Please enter a positive number greater than zero.";
          }
        },
        {
          type: "input",
          name: "internEmail",
          message: "What is their email?",
          validate: async input => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
              return true;
            }
            return "Please enter a valid email address.";
          }
        },
        {
          type: "input",
          name: "internSchool",
          message: "What is  school?",
          validate: async input => {
            if (input === "") {
              return "Please enter a name.";
            }
            return true;
          }
        }
      ])
      //adding the new intern's info
      .then(answers => {
        const intern = new Intern(
          answers.internName,
          answers.internId,
          answers.internEmail,
          answers.internSchool
        );
        teamMembers.push(intern);
        idArray.push(answers.internId);
        createTeam();
      });
  }
  //creating the HTML with the new info that was entered
  function buildTeam() {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }
    fs.writeFileSync(outputPath, render(teamMembers), "utf-8");
  }

  createManager();
}

appMenu();

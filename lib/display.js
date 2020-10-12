const table = require("table").table;
const chalk = require("chalk");

const green = chalk.green;
const amber = chalk.yellowBright;
const red = chalk.white.bgRed;

exports.asTable = athleteResults => {
  var data = [];

  var header = ["Last", "First", "Swim", "Bike", "Run", "Strength", "Total"];
  data.push(header);

  athleteResults.forEach(result => {
    const swimMissed = result.compliance.get("swim").missed;
    const bikeMissed = result.compliance.get("bike").missed;
    const runMissed = result.compliance.get("run").missed;
    const strengthMissed = result.compliance.get("strength").missed;
    const totalMissed = result.compliance.get("total").missed;

    const record = [
      result.athlete.LastName,
      result.athlete.FirstName,
      swimMissed == 0 ? green("swim") : swimMissed == 1 ? amber("swim") : red("swim"),
      bikeMissed == 0 ? green("bike") : bikeMissed == 1 ? amber("bike") : red("bike"),
      runMissed == 0 ? green("run") : runMissed == 1 ? amber("run") : red("run"),
      strengthMissed == 0
        ? green("strength")
        : strengthMissed == 1
        ? amber("strength")
        : red("strength"),
      totalMissed == 0 ? green("total") : totalMissed == 1 ? amber("total") : red("total")
    ];
    data.push(record);
  });
  console.log("\n");
  console.log(table(data));
};

require("mocha").describe;
require("chai").should();

const testdata = require("./testdata");
const analyze = require("../lib/analyze");

describe("Workout compliance tests:", function() {
  const compliance = analyze.compliance({}, testdata.workouts);
  it("Swim Count is 4", function() {
    compliance.get("swim").count.should.equal(4);
  });

  it("Bike Missed is 1", function() {
    compliance.get("bike").missed.should.equal(1);
  });

  it("Run Green is 1", function() {
    compliance.get("run").green.should.equal(3);
  });
});

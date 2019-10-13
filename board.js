
(function() {

function passesToAverage(passes) {
    // TODO: Only count valid passes/traps???
    return (1.0 / passes.length) * passes.reduce(function(sum, pass) {
        return sum + (typeof pass.pointsPass === "number" ? pass.pointsPass : 0.0);
    }, 0.0);
}

function passesToPilotsObject(dataset) {
    const iPilot = dataset.fields.indexOf("Name");
    const iGrade = dataset.fields.indexOf("Grade");
    const iPointsPass = dataset.fields.indexOf("Points Pass");
    const iPointsFinal = dataset.fields.indexOf("Points Final");
    const iWire = dataset.fields.indexOf("Wire");
    const iDetails = dataset.fields.indexOf("Details");
    const iAirframe = dataset.fields.indexOf("Airframe");
    const iCase = dataset.fields.indexOf("Case");
    const iOSDate = dataset.fields.indexOf("OS Date");
    const pilots = {}
    dataset.records.forEach(function(record) {
        const pilotName = record[iPilot];
        if(!pilots[pilotName]) {
            pilots[pilotName] = { name: pilotName, passes: [], avg: 0.0 };
        }
        pilots[pilotName].passes.push({ pointsPass: record[iPointsPass], pointsFinal: record[iPointsFinal], wire: record[iWire], grade: record[iGrade], details: record[iDetails], airframe: record[iAirframe], case: record[iCase], irlDate: record[iOSDate] });
    });

    Object.keys(pilots).forEach(function(pilotName) {
        const pilot = pilots[pilotName]
        pilot.airframes = pilot.passes.map((p) => p.airframe).filter((val, i, a) => a.indexOf(val) === i);
        pilot.avg = passesToAverage(pilots[pilotName].passes);
    });

    return pilots;
}

function pointsToBgClass(points, grade) {
    if(grade.includes("BOLTER")) { return "bg-blue"; }
    if(grade.includes("WO")) { return "bg-red"; }
    if(typeof points !== "number" || points <= 0.0) { return "bg-brown"; }
    if(points <= 1.0) { return "bg-red"; }
    if(points <= 2.0) { return "bg-orange"; }
    if(points <= 3.0) { return "bg-yellow"; }
    return "bg-green";
}

function passToTrapCharacter(pass) {
    if(typeof pass.wire === "number") { return pass.wire; }
    if(pass.grade.includes("BOLTER")) { return "B"; }
    return "";
}

function passToScoreCell(pass) {
    return `<td class="score_cell ${pointsToBgClass(pass.pointsPass, pass.grade)} case${(pass.case)}" title="Score: ${pass.pointsPass}  Grade: ${pass.grade}  Case${pass.case}  Details: ${pass.details}  Airframe: ${pass.airframe}  IRL date: ${pass.irlDate}">${passToTrapCharacter(pass)}</td>`
}

function pilotToTableLine(pilot, rank) {
    const last20Passes = pilot.passes.slice(-20);
    return `
<tr>
    <td>${rank + 1}</td>
    <td>${pilot.name}</td>
    <td>${pilot.airframes}</td>
    <td>${pilot.avg.toFixed(2)}</td>
    <td>${last20Passes.length !== pilot.passes.length ? "..." : ""}</td>
    ${last20Passes.map(passToScoreCell).join("\n")}
</tr>
`
}


window.boardFunctions = {

    fill: function(dataset, targetTbody) {
        const pilots = passesToPilotsObject(dataset);
        const pilotList = Object.keys(pilots).map(function(key) { return pilots[key] });
        const sortedPilotList = pilotList.sort(function(a, b) { return b.avg - a.avg; });

        innerHTML = "";
        sortedPilotList.forEach(function (pilot, index) {
            const rank = index;
            innerHTML += pilotToTableLine(pilot, rank);
        });

        targetTbody.innerHTML = innerHTML;
    }
}

})();
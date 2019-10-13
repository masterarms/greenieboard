
(function() {

function passesToAverage(passes) {
    // TODO: Only count valid passes/traps???
    return (1.0 / passes.length) * passes.reduce(function(sum, pass) {
        return sum + (typeof pass.pointsFinal === "number" ? pass.pointsFinal : 0.0);
    }, 0.0);
}

function passesToPilotsObject(dataset) {
    const iPilot = dataset.fields.indexOf("Name");
    const iGrade = dataset.fields.indexOf("Grade");
    const iPointsPass = dataset.fields.indexOf("Points Pass");
    const iPointsFinal = dataset.fields.indexOf("Points Final");
    const iWire = dataset.fields.indexOf("Wire");
    const pilots = {}
    dataset.records.forEach(function(record) {
        const pilotName = record[iPilot];
        if(!pilots[pilotName]) {
            pilots[pilotName] = { name: pilotName, passes: [], avg: 0.0 };
        }
        pilots[pilotName].passes.push({ pointsPass: record[iPointsPass], pointsFinal: record[iPointsFinal], wire: record[iWire], grade: record[iGrade] });
        // TODO: pilots[pilotName].aircraft[]
        pilots[pilotName].avg = passesToAverage(pilots[pilotName].passes);
    });
    return pilots;
}

function gradeToBgClass(points) {
    if(typeof points !== "number" || points <= 0.0) { return "bg-black"; }
    if(points <= 1.0) { return "bg-red"; }
    if(points <= 2.0) { return "bg-orange"; }
    if(points <= 3.0) { return "bg-yellow"; }
    return "bg-green";
}

function passToScoreCell(pass) {
    return `<td class="score_cell ${gradeToBgClass(pass.pointsFinal)}" title="Score: ${pass.pointsPass} Grade: ${pass.grade}">${typeof pass.wire === "number" ? pass.wire : ""}</td>`
}

function pilotToTableLine(pilot, rank) {
    return `
<tr>
    <td>${rank + 1}</td>
    <td>${pilot.name}</td>
    <td>${pilot.avg.toFixed(2)}</td>
    ${pilot.passes.map(passToScoreCell).join("\n")}
</tr>
`
}


window.boardFunctions = {

    fill: function(dataset, targetTbody) {
        console.log("Filling...", dataset);

        const pilots = passesToPilotsObject(dataset);
        console.log("Pilots", pilots);

        const pilotList = Object.keys(pilots).map(function(key) { return pilots[key] });
        console.log("Pilotlist", pilotList);
        const sortedPilotList = pilotList.sort(function(a, b) { return a.avg - b.avg; });

        innerHTML = "";
        sortedPilotList.forEach(function (pilot, index) {
            const rank = index;
            innerHTML += pilotToTableLine(pilot, rank);
        });

        targetTbody.innerHTML = innerHTML;
    }
}

})();
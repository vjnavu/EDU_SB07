function addModules() {
    var modules = {
        narration: function(modules, page) {
            var module = createNarration({
                moduleName: "NARRATION",
                box: amt.get(".narration", page),
                audioList: ["./media/audios/proto_km_510.mp3"],
                sceneTimes: [
                    { start: 4, end: 10 },
                    { start: 20, end: 50 },
                    { start: 50, end: 70 }
                ],
                textTimes: [
                    { start: 4, end: 6},
                    { start: 6, end: 10},
                    { start: 10, end: 13},
                    { start: 13, end: 16}
                ]
            })
            module.start();
            modules.push(module);
        }
    }
    return modules;
}

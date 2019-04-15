class TimerUI extends Phaser.Group {
    constructor() {
        super(game);

        this.text = null;
        this.timerIcon = null;
        this.currentTime = 0;
    }

    create() {
        var bg = this.game.add.sprite(0, 0, "base-ui");
        bg.anchor.set(0.5);
        this.add(bg);

        this.timerIcon = this.game.add.sprite(0, 0, "icon-timer");
        this.timerIcon.anchor.set(0.5);
        this.timerIcon.position.set(-45, -5);
        this.add(this.timerIcon);

        var nameTextOption = { font: "27.5px Vag", fill: "#f86d07", align: "center", wordWrap: true };
        this.text = this.game.add.text(20, 0, this.score, nameTextOption);
        this.text.anchor.set(0.5);
        this.add(this.text);
    }

    setMiliSeconds(miliSeconds) {
        var elapsedSec = Math.round(miliSeconds / 1000);

        var seconds = Math.floor(elapsedSec % 60);
        var minutes = Math.floor(elapsedSec / 60);

        var secondsStr = (seconds < 10 ? "0" + seconds.toString() : seconds.toString());
        var minutesStr = (minutes < 10 ? "0" + minutes.toString() : minutes.toString());

        this.text.text = minutesStr + ":" + secondsStr;
    }
}
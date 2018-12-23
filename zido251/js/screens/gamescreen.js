class GameScreen
{

    createCustomPointer()
    {
        this.customPointer = new CustomPointer(game, -100, -100);
        this.game.add.existing(this.customPointer);
    }

    createLogo()
    {
        this.logo = game.add.sprite(game.world.width-90, 0 + 10, "zido-logo");
    }
}
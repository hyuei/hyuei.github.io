class ImageAssetsData
{
    constructor()
    {
        this.data = [];

        // sample
        // {id:"avatar-cheer", file:"assets/avatar-cheer.png"}
    }

    loadAsset(game)
    {
        for (var itAsset = 0; itAsset < this.data.length; itAsset++)
        {
            game.load.image(this.data[itAsset].id, this.data[itAsset].file);
        }
    }
}
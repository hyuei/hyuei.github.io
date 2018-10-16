class ImageAssetsData
{
    constructor()
    {
        this.data = [];
        this.atlas = [];

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

    loadAtlas(game){
        for(var i=0; i<this.atlas.length; i++){
            game.load.atlas(this.atlas[i].id, this.atlas[i].file, this.atlas[i].json);
        }
    }
}
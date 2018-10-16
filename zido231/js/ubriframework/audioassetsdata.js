class AudioAssetsData
{
    constructor()
    {
        this.data = [];
        this.audioUrl = 'assets/audio/';
        // sample
        // {id:"avatar-cheer", file:"avatar-cheer", type:"sfx"}
    }

    loadAsset(game)
    {
        for (var itAsset = 0; itAsset < this.data.length; itAsset++)
        {
            // game.load.audio(this.data[itAsset].id, [this.audioUrl + this.data[itAsset].file + '.mp3', this.audioUrl + this.data[itAsset].file + '.ogg']);
            Asset.audio(this.data[itAsset].id, this.data[itAsset].file)
        }
    }

    init(){
        for(var a = 0; a < this.data.length; a++){
            var data = this.data[a];
            if(data.hasOwnProperty('type')){
                if(data.type == 'bgm'){
                    SoundData.bgmObj[data.id] = game.add.audio(data.id, 1, true)
                } else {
                    SoundData.sfxObj[data.id] = game.add.audio(data.id, 1, false)
                }
            }
        }
    }
}

SoundData = {
    sfxVolume : 1,
    bgmVolume : 0.8,
    sfxObj : {},
    bgmObj : {},
    mobileSFX : true,

    sfxPlay:function(name, volume) {
        volume = volume ? volume : 1;

        if (!Phaser.Device.desktop && !SoundData.mobileSFX) {
            return;
        }

        if(!SoundData.sfxObj[name]) return;
        SoundData.sfxObj[name].play("",0,SoundData.sfxVolume);
    }
}
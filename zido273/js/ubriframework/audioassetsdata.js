AudioAssetsData = function(){
    this.data = [];
    this.audioUrl = 'assets/audio/';
};

AudioAssetsData.prototype = {
    loadAsset:function(game)
    {
        for (var itAsset = 0; itAsset < this.data.length; itAsset++)
        {
            // game.load.audio(this.data[itAsset].id, [this.audioUrl + this.data[itAsset].file + '.mp3', this.audioUrl + this.data[itAsset].file + '.ogg']);
            Asset.audio(this.data[itAsset].id, this.data[itAsset].file)
        }
    },

    init:function(){
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
    idx:-1,
    ready:false,
    sfxMute:false,
    bgmMute:false,
    isPlaying:true,

    sfxPlay:function(name, volume) {
        volume = volume ? volume : 1;

        if (!Phaser.Device.desktop && !SoundData.mobileSFX) {
            return;
        }

        if(!SoundData.sfxObj[name]) return;
        SoundData.sfxObj[name].play("",0,SoundData.sfxVolume);
    },

    bgmPlay:function(idx, forcePlay) {
        if( typeof idx == 'undefined' || idx == null) {
            idx = 0;
        }

        if( typeof forcePlay == 'undefined' || forcePlay == null) {
            forcePlay = false;
        }

        if (idx != SoundData.idx || forcePlay) {
            if (SoundData.bgmObj[SoundData.idx])
                if (SoundData.bgmObj[SoundData.idx].isPlaying)
                    SoundData.bgmObj[SoundData.idx].stop();

            SoundData.idx = idx;
            SoundData.isPlaying = true;
            
            if(SoundData.bgmMute) return;

            SoundData.bgmObj[SoundData.idx].play("",0,SoundData.bgmVolume,true,false);
        }
    },

    bgmStop:function(){
        SoundData.bgmObj[SoundData.idx].stop();
    },
}
class TalkingData{
    constructor()
    {
        this.talkingdata =
        {
            CookGame_Prolog:
            [
                {char:"", en:"Yum, it's almost time for lunch!", talk:"حَسَناً، لَقَدْ حَانَ وَقْتُ وَجْبَةِ الْغَدَاءِ!", voice:"01.mp3"},
                {char:"", en:"Let's help our parents to prepare the lunch.", talk:"لِنُسَاعِدْ وَالِدَيْنَا فِي إِعْدَادِ وَجْبَةِ الْغَدَاءِ.", voice:"02.mp3"},
                {char:"", en:"I can't cook yet, but at least I can slice things.", talk:"لَا أَسْتَطِيعُ حَتَّى الْآنَ أَنْ أُعِدَّ بَعْضَ الْأَطْبَاقِ، لَكِنْ يُمْكِنُنِي أَنْ أَقُومَ بِتَقْطِيعِ الْمُكَوِّنَاتِ.", voice:"03.mp3"},
                {char:"", en:"Please help me to slice these ingredients so that mom can cook it later!", talk:"رَجَاءً سَاعِدْنِي فِي تَقْطِيعِ هَذِهِ الْمُكَوِّنَاتِ حَتَّى تَتَمَكَّنَ أُمِّي مِنْ طَهْيِهَا لَاحِقاً !", voice:"04.mp3"},
                {char:"", en:"Slide through the dotted lines to cut them.", talk:"اِتَّبِعْ مَسَارَ الْخُطُوطِ الْمُنَقَّطَةِ سَيُسَاعِدُكَ ذَلِكَ فِي تَقْطيعِ الْمُكَوِّنَاتِ", voice:"05.mp3"},
                {char:"", en:"If you see any flying ingredients, slide through them to slice it!", talk:"إِذَا ظَهَرَتْ لَكَ مُكَوِّنَاتٌ أُخْرَى طَائِرَةٌ، اقْطَعْهَا بِاِتِّبَاعِ نَفْسِ الطَّرِيقَةِ!", premeta:"showtutorial",postmeta:"hidetutorial", voice:"06.mp3"},
                {char:"", en:"Let's start cooking, then!", talk:"لِنَبْدَأْ الطَّهْيَ الْآنَ إِذَنْ!", voice:"07.mp3", postmeta:"show_start_button"},
                {char:"", en:"Start", talk:"ابْدَأْ", voice:"08.mp3", postmeta:"show_start_button"},
            ],

            CookGame_End:
            [
                {char:"", en:"Great job! All of them are looking great.", talk:"رَائِعٌ ! كُلُّ الْمُكَوِّنَاتِ أَصْبَحَتْ جَاهِزَةً ", voice:"09.mp3"},
                {char:"", en:"Now, mom can cook them for lunch.", talk:"يُمْكِنُ لِأُمِّي الْآنَ أَنْ تَسْتَعْمِلَهَا فِي تَحْضِيرِ وَجْبَةِ الْغَدَاءِ.", voice:"10.mp3"},
                {char:"", en:"It's gonna be delicious!", talk:"لَا شَكَّ أَنَّ أُمِّي سَتُحَضِّرُ لَنَا أَطْبَاقاً شَهِيَّةً جِدّاً !", voice:"11.mp3"},
                {char:"", en:"Thank you, and don't forget to eat your meal too!", talk:"شُكْراً جَزِيلاً لَكَ، رَجَاءً لَا تَنْسَ تَنَاوُلَ وَجْبَتِكَ كَذَلِكَ!", voice:"12.mp3", postmeta:"endgame"},
            ]
        };
    }

    loadAudios(game, talkingArray)
    {
        for (var itTalk = 0; itTalk < talkingArray.length; itTalk++)
        {
            if(talkingArray[itTalk].hasOwnProperty('voice'))
            {
                var fileName = talkingArray[itTalk].voice;
                if (fileName !== null && fileName !== "") {
                    game.load.audio(fileName, "assets/voice/" + fileName);
                }
            }
        }
    }

    
}
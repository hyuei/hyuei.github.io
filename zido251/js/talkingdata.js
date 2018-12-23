class TalkingData{
    constructor()
    {
        this.talkingdata =
        {
            ClimbTree_Prolog:
            [
                {char:"", en:"Whoa, that's a very tall tree!", talk:"وَاوْ، إِنَّهَا شَجَرَةٌ بَاسِقَةٌ جِدّاً!", voice:"02.mp3"},
                {char:"", en:"As in the animation, we need to climb the tree to help Oryx.", talk:"يَتَعَيَّنُ عَلَيْنَا تَسَلُّقُ الشَّجَرَةِ لِمُسَاعَدَةِ أُورِيكْسَ مِثْلَمَا كَانَ ذَلِكَ فِي الرُّسُومِ الْمُتَحَرِّكَةِ.", voice:"03.mp3"},
                {char:"", en:"But don't worry, Bilal is great when it comes to climbing.", talk:"لَكِنْ لَا تَقْلَقْ، إِنَّ بِلَالَ مَاهِرٌ عِنْدَمَا يَتَعَلَّقُ الْأَمْرُ بِالتَّسَلُّقِ. ", voice:"04.mp3"},
                {char:"", en:"Let’s help Bilal to climb the tree!", talk:"هَيَّا بِنَا نُسَاعِدُ بِلَالَ عَلَى تَسَلُّقِ الشَّجَرَةِ!", voice:"", postmeta: "showtutorial", voice:"05.mp3"},
                {char:"", en:"Press right or left arrow on the keyboard to jump to the left or the right side.", talk:"اضْغَطْ عَلَى سَهْمَيِ الْاتِّجَاهِ الْأَيْمَنِ أَوِ الْأَيْسَرِ عَلَى لَوْحَةِ الْمَفَاتِيحِ مِنْ أَجْلِ الُقَفْزِ يَمِيناً أَوْ يَسَاراً.", voice:"", premeta:"show_tutimg01", postmeta:"hide_tutimg01", voice:"06.mp3"},
                {char:"", en:"You can also click on the left or right side of the screen to jump to the left or the right side.", talk:"يُمْكِنُكَ كَذَلِكَ النَّقْرُ عَلَى الْجِهَةِ الْيُسْرَى أَوِ الْجِهًةِ الْيُمْنَى لِلشَّاشَةِ مِنْ أَجْلِ الْقَفْزِ يَسَاراً أَوْ يَمِيناً.", premeta:"show_tutimg02", postmeta:"hide_tutimg02", voice:"07.mp3"},
                {char:"", en:"Be careful not to step on the weak branches. It may break!", talk:"انْتَبِهْ لِئَلَّا تَطَأَ الْأَغْصَانَ الْهَشَّةَ لِأَنَّهَا قَدْ تَنْكَسِرُ!", voice:"", premeta:"show_tutimg03", postmeta:"hide_tutimg03", voice:"09.mp3"},
                {char:"", en:"You don't have to reach the top, but be sure to climb high enough!", talk:"لَسْتَ مُجْبَراً عَلَى الْوُصُولِ إِلَى الْقِمَّةِ، لَكِنْ عَلَيْكَ التَّأَكُّدُ مِنْ تَسَلُّقِ ارْتِفَاعٍ كَافٍ!", voice:"10.mp3"},
                {char:"", en:"Start", talk:"ابْدَأْ", postmeta:"show_start_button", voice:"11.mp3"},
            ],

            ClimbTree_End:
            [
                {char:"", en:"Nice, you have reached sufficient height!", talk:"هَذَا رَائِعٌ، لَقَدْ بَلَغْتَ ارْتِفَاعاً مَقْبُولاً!", voice:"14.mp3"},
                {char:"", en:"Thanks to your help, we can help release Oryx from the tree.", talk:"شُكْراً لِمُسَاعَدَتِكَ، يُمْكِنُنَا أَنْ نُسَاعِدَ فِي تَخْلِيصِ أُورِيكْسَ مِنَ الشَّجَرَةِ.", voice:"15.mp3"},
                {char:"", en:"Watch the animation to see how they helped Oryx!", talk:"شَاهِدْ تَسْجِيلَ الرُّسُومِ الْمُتَحَرِّكَةِ لِتَعْرِفَ كَيْفَ تَمَّتْ مُسَاعَدَةُ أُورِيكْسَ!", voice:"16.mp3"},
                {char:"", en:"Thank you and see you next time!", talk:"شُكْراً لَك وَنَرَاك فِي الْمَرَّةِ الْمُقْبِلَةِ!", postmeta:"endgame", voice:"17.mp3"},
            ],

            ClimbTree_Fail:
            [
                {char:"", en:"Oops, too bad, you're not quite high enough.", talk:"أُووهْ، هَذَا سَيِّءٌ جِدّاً، لَسْتَ عَلَى ارْتِفَاعٍ كَافٍ.", voice:"12.mp3"},
                {char:"", en:"Maybe you can try again and see if you can reach higher!", talk:"رُبَمَا يَجْدُرُ بِكَ الْمُحَاوَلَةُ مُجَدَّداً وَاحْرِصْ عَلَى بُلُوغِ ارْتِفَاعٍ أَعْلَى!", postmeta: "failgame", voice:"13.mp3"},
            ],

            Shop_Prolog:
            [
                {char:"", en:"Let's play game", talk:"Let's play game", postmeta:"show_start_button"}
            ],

            Shop_End:
            [
                {char:"", en:"Game has ended, thank you!", talk:"Game has ended, thank you!", postmeta:"endgame"}
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
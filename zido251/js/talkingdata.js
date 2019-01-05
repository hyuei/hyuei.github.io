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
                {char:"", en:"Hello and welcome to the market!", talk:"السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَهِ، مَرْحَباً بِكُمْ إِلَى مَتْجَرِ الْفَاكِهَةِ!", voice:"01.mp3", postmeta:""},
                {char:"", en:"Our little heroes are going to the market to get some inspiration.", talk:"سَيَقْصِدُ أَبْطَالُنَا الصِّغَارُ الْمَتْجَرَ لِلْحُصُولِ عَلَى بَعْضِ الْإِثَارَةِ إِنْ شَاءَ اللَهُ.", voice:"02.mp3", postmeta:""},
                {char:"", en:"But, this fruit market needs some help!", talk:"لَكِنَّ صَاحِبَ مَتْجَرِ الْفَاكِهَةِ هَذَا بِحَاجَةٍ إِلَى بَعْضِ الْمُسَاعَدَةِ!", voice:"03.mp3", postmeta:""},
                {char:"", en:"Let's help him to manage his business by giving the customer what they need.", talk:"فَلْنُسَاعِدْهُ فِي تَسْيِيرِ شُؤُونِ مَحَلِّهِ بِإِعْطَاءِ كُلِّ زَبُونٍ مَا يَحْتَاجُهُ.", voice:"04.mp3", postmeta:""},
                {char:"", en:"There will be a customer asking for some fruits.", talk:"سَوْفَ نُصَادِفُ زُبَنَاءَ يَبْحَثُونَ عَنْ بَعْضِ أَنْوَاعِ الْفَاكِهَةِ.", premeta:"show_tutimg01", voice:"05.mp3", postmeta: "hide_tutimg01"},
                {char:"", en:"You'll need to get the right fruit by clicking on each fruit blocks.", talk:"سَتَكُونُ مُطَالَباً بِالْتِقَاطِ الْفَاكِهَةِ الْمُنَاسِبَةِ مِنْ خِلَالِ النَّقْرِ عَلَى صُنْدُوقِ كُلِّ نَوْعٍ  مِنَ الْفَاكِهَةِ عَلَى حِدَةٍ.", voice:"06.mp3", premeta:"show_tutimg02", postmeta: "hide_tutimg02"},
                {char:"", en:"If you're sure that you've got all the things they need, press the submit button to give them the fruits!", talk:"إِنْ كُنْتَ مُتَأَكِّداً مِنْ أَنَّكَ قَدْ حَصَلْتَ عَلَى جَمِيعِ طَلَباَتِ الزُّبَنَاءِ، اضْغَطْ عَلَى زِرِّ \"تَأْكِيد\" لِكَيْ تٌسَلِّمَهُمُ الْفَاكِهَةَ!", voice:"07.mp3", premeta:"show_tutimg03", postmeta: "hide_tutimg03"},
                {char:"", en:"But, if you think that you have picked the wrong fruit, press the delete button to re-pick the fruits.", talk:"بِالْمُقَابِلِ، إِنْ كُنْتَ تَظُنُّ أَنَّكَ قُمْتَ بِالْتِقَاطِ الْفَاكِهَةِ الْخَطَإِ، اضْغَطْ عَلَى الزِّرِّ \"حَذْفٌ\" لِكَيْ تٌعِيدَ اخْتِيَارَ الْفَاكِهَةِ مِنْ جَدِيدٍ.", voice:"08.mp3",  premeta:"show_tutimg04", postmeta: "hide_tutimg04"},
                {char:"", en:"Be careful not to take too much time or giving them the wrong fruits, since they will be leaving without buying anything.", talk:"حَذَارِ أَنْ تَسْتَغْرِقَ وَقْتاً طَوِيلاً فِي الِاخْتِيَارِ أَوْ تُسَلِّمَهُمُ الْفَاكِهَةَ الْخَطَأَ، لِأَنَّهُمْ وَبِكُلِّ بَسَاطَةٍ سَيُغَادِرُونَ دُونَ شِرَاءِ أَيِّ شَيْءٍ.", voice:"09.mp3",premeta:"show_tutimg05", postmeta: "hide_tutimg05"},
                {char:"", en:"Easy, right? Then let's get ready!", talk:"الْأَمْرُ فِي غَايَةِ السُّهُولَةِ، أَلَيْسَ كَذَلِكَ؟ إِذَنْ لِنَسْتَعِدَّ!", voice:"10.mp3"},
                {char:"", en:"Start!", talk:"ابْدَأْ", voice:"11.mp3",postmeta:"show_start_button"}
            ],
            Shop_Fail:
            [
                {char:"", en:"Store's closed!", talk:"الْمَتْجَرُ مُغْلَقٌ!", voice:"12.mp3", postmeta:""},
                {char:"", en:"I think your score could be better than this.", talk:"أَعْتَقِدُ أَنَّهُ بِإِمْكَانِكَ إِحْرَازُ نَتِيجَةٍ أَفْضَلَ مِنْ هَذِهِ.", voice:"13.mp3",  postmeta:""},
                {char:"", en:"Try to play again and see if you can score better!", talk:"حَاوِلْ مَرَّةً أُخْرَى لِنَنْظُرَ أَيُمْكِنُكَ إِحْرَازُ نَتِيجَةٍ أَفْضَلَ!", voice:"14.mp3",  postmeta:"failgame"}
            ],

            Shop_End:
            [
                {char:"", en:"Store's closed!", talk:"الْمَتْجَرُ مُغْلَقٌ!", voice:"15.mp3", postmeta:""},
                {char:"", en:"The store owner is very happy with all the coins that we have collected.", talk:"صَاحِبُ الْمَتْجَرِ فِي غاَيَةِ السَّعَادَةِ بِالْقِطَعِ النَّقْدِيَّةِ الَّتِي قُمْنَا بِجَمْعِهَا.", voice:"16.mp3",  postmeta:""},
                {char:"", en:"Great job! You have talents in being a market owner.", talk:"عَمَلٌ رَائِعٌ! أَنْتَ حَقّاً مَوْهُوبٌ فِي تَسْيِيرِ الْمَتَاجِرِ.", voice:"17.mp3",  postmeta:""},
                {char:"", en:"Thanks for helping, and see you!", talk:"شُكْراً عَلَى الْمُسَاعَدَةِ، نَرَاكَ لَاحِقاً!", voice:"18.mp3",  postmeta:"endgame"}
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
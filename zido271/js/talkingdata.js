class TalkingData {
    constructor() {
        this.talkingdata =
            {
                PopGame_Prolog:
                    [
                        { char: "", en: "Hello there, healthy people.", talk: "السَّلَامُ عَلَيْكُمْ، مَرْحَباً !" },
                        { char: "", en: "Welcome to the healthy food corner", talk: "أَهْلاً بِكَ! سَيَكُونُ مَوْضُوعُنَا الْيَوْمَ عَنِ الطَّعَامِ الصِّحِّيِّ"},
                        { char: "", en: "There are so many healthy food out there, including vegetables", talk: "هُنَاكَ أَنْوَاعٌ مُتَعَدِّدَةٌ مِنَ الْأَطْعِمَةِ الصِّحِّيَّةِ وَالْمُفِيدَةِ مِنْ بَيْنِهَا الْخُضْرَواتُ " },
                        { char: "", en: "Let's help collecting the vegetables here", talk: "هَيَّا بِنَا نُسَاعِدُ فِي قَطْفِ الْخُضْرَواتِ الْمَوْجُودَةِ هُنَا!"},
                        { char: "", en: "So there's a bunch of vegetable here", talk: "تُوجَدُ مَجْمُوعَةٌ مِنَ الْخُضْرَواتِ هُنَا", premeta: "showtut_01", postmeta: "hidetut_01" },
                        { char: "", en: "Tap on vegetables which has 3 or more same vegetables connected", talk: "اضْغَطْ لِتُشَكِّلَ مَجْمُوعَاتٍ مُكَوَّنَةً مِنْ ثَلَاثَةِ أَنْوَاعٍ  أَوْ أَكْثَرَ مِنَ الْخُضْرَواتِ الْمُتَشَابِهَةِ", premeta: "showtut_02", postmeta: "hidetut_02" },
                        { char: "", en: "Larger chain will results in larger scores", talk: "كُلَّمَا كَانَتِ السِّلْسِلَةُ أَطْوَلَ كُلَّمَا ازْدَادَ عَدَدُ نِقَاطِ الرَّصيدِ", premeta: "showtut_03", postmeta: "hidetut_03" },
                        { char: "", en: "Try to get the largest score within the time limit", talk: "حَاوِلْ أَنْ تَجْمَعَ أكْبَرَ عَدَدٍ مُمْكِنٍ مِنَ النِّقَاطِ قَبْلَ انْتِهَاءِ الْمُدَّةِ الزَّمَنِيَّةِ الْمُحَدَّدَةِ", premeta: "showtut_04", postmeta: "hidetut_04" },
                        { char: "", en: "When you see this shiny vegetable, tap on it to get a special effect!", talk: "عِنْدَ رُؤْيَةِ هَذِهِ الخُضْرَوَاتِ  المُضِيئَةِ، انْقُرْ عَلَيْهَا وَسَتَحْصُلُ عَلَى التَّأْثِيرِ الْخَاصِّ!", premeta: "showtut_05", postmeta: "hidetut_05" },
                        { char: "", en: "Start", talk: "ابْدَأْ", postmeta: "show_start_button", voice: "10.mp3" },
                    ],

                PopGame_Fail:
                    [
                        { char: "", en: "Time's up!", talk: "انْتَهَى الْوَقْتُ !"},
                        { char: "", en: "Thanks for your help, maybe next time we can collect more than this", talk: "شُكْراً عَلَى الْمُسَاعَدَةِ، يُمْكِنُنَا فِي الْمَرَّةِ الْقَادِمَةِ أَنْ نَقْطُفَ كَمِّيَّةً أكْبَرَ مِنَ الْخُضْرَواتِ"},
                        { char: "", en: "Don't forget to eat your vegetables!", talk: "لَا تَنْسَ أَنْ تَتَنَاوَلَ  الْخُضْرَواتِ  النَّيِّئَةَ أَوْ الْمَطْبُوخَةَ لِأَنَّهَا مُهِمَّةٌ جِدّاً لِصِحَّتِكَ", postmeta: "failgame" },
                    ],
                PopGame_End:
                    [
                        { char: "", en: "And that's a wrap!", talk: "انْتَهَتِ الْمُهِمَّةُ!"},
                        { char: "", en: "You collected so much, great job!", talk: "لَقَدْ جَمَعْتَ الْكَثِيرَ، أَحْسَنْتَ!"},
                        { char: "", en: "This'll make a lot of vegetable dishes", talk: "يُمْكِنُنَا أَنْ نَسْتَعْمِلَ هَذِهِ الْخُضْرَواتِ فِي تَحْضِيرِ كَثِيرٍ مِنَ الْأَطْبَاقِ الشَّهِيَّةِ" },
                        { char: "", en: "Thanks for your help and don't forget to eat vegetables too", talk: "جَزَاكَ اللَّهُ خَيْراً وَشُكْراً عَلَى مُسَاعَدَتِكَ. أَخِيراً، لَا تَنْسَ أَنْ تَتَنَاوَلَ مَا يَكْفِيكَ مِنَ الْخُضْرَواتِ !", postmeta: "endgame" },
                    ]

            };
    }

    loadAudios(game, talkingArray) {
        for (var itTalk = 0; itTalk < talkingArray.length; itTalk++) {
            if (talkingArray[itTalk].hasOwnProperty('voice')) {
                var fileName = talkingArray[itTalk].voice;
                if (fileName !== null && fileName !== "") {
                    game.load.audio(fileName, "assets/voice/" + fileName);
                }
            }
        }
    }


}
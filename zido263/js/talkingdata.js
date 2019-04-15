class TalkingData {
    constructor() {
        this.talkingdata =
            {
                TrashSelector_Prolog:
                    [
                        { char: "", en: "Hi there! Welcome to the garden again.", talk: "مَرْحَباً ! أَهْلاً بِكَ مَرَّةً أُخْرَى فِي الْحَديقَةِ.", voice: "01.mp3" },
                        { char: "", en: "As you can see, there are various baskets here.", talk: "كَمَا تَرَى، لَدَيْنَا مَجْمُوعَةٌ مُتَنَوِّعَةٌ مِنَ السَّلَّاتِ.", voice: "02.mp3" },
                        { char: "", en: "Since our little friend will need to sort the trashes before they can process it, could you help them sorting it?", talk: "صَدِيقُنَا الصَّغِيرُ يَحْتَاجُ إِلَى فَرْزِ النُّفَايَاتِ لِيُعِيدَ اسْتِخْدَامَهَا بَعْدَ ذَلِكَ، هَلْ يُمْكِنُكَ مُسَاعَدَتُهُ فِي عَمَلِيَّةِ الْفَرْزِ؟", voice: "03.mp3" },
                        { char: "", en: "It's quite simple: pick a trash from the pile and then drag it to the correct basket.", talk: "الْأَمْرُ بَسِيطٌ لِلْغَايَةِ: اخْتَرْ نُفَايَةً مُعَيَّنَةً ثُمَّ اسْحَبْهَا إِلَى السَّلَّةِ الْمُنَاسِبَةِ.", premeta: "showtut_01", postmeta: "hidetut_01", voice: "04.mp3" },
                        { char: "", en: "There are basket for bottle, packaging, and fabric.", talk: "هُنَاكَ سَلَّةٌ لِلزُّجَاجَاتِ، سَلَّةٌ لِلْأَغْلِفَةِ، وَ أُخْرَى لِلْأَقْمِشَةِ.", premeta: "showtut_02", postmeta: "hidetut_02", voice: "05.mp3" },
                        { char: "", en: "After you finished a pile, another pile will come.", talk: "بَعْدَ الْاِنْتِهَاءِ مِنْ كُومَةٍ مَا، سَتَأْتِي كُومَةٌ أُخْرَى بَعْدَهَا.", premeta: "showtut_03", postmeta: "hidetut_03", voice: "06.mp3" },
                        { char: "", en: "Be careful with the raccoon! They will try to steal your trashes.", talk: "انْتَبِهْ إِلَى الرَّاكُونِ ! سَيُحَاوِلُ سَرِقَةَ النُّفَايَاتِ.", premeta: "showtut_04", postmeta: "hidetut_04", voice: "07.mp3" },
                        { char: "", en: "Tap on the raccoon to prevent them from stealing!", talk: "اضْغَطْ عَلَى الرَّاكُونِ لِتَمْنَعَهُ مِنَ السَّرِقَةِ !", premeta: "showtut_05", postmeta: "hidetut_05", voice: "08.mp3" },
                        { char: "", en: "Good luck with the sorting!", talk: "حَظّاً سَعِيداً فِي عَمَلِيَّةِ الْفَرْزِ !", voice: "09.mp3" },
                        { char: "", en: "Start", talk: "ابْدَأْ", postmeta: "show_start_button", voice: "10.mp3" },
                    ],

                TrashSelector_Fail:
                    [
                        { char: "", en: "Well, it seems that we have a lot of things still unsorted.", talk: "حَسناً، مَازَالَ لَدَيْنَا الْكَثِيرُ مِنَ الْأَشْيَاءِ الَّتِي تَحْتَاجُ  أَيْضاً إِلَى عَمَلِيَّةِ الْفَرْزِ", voice: "11.mp3" },
                        { char: "", en: "Maybe you can come back later and help again to get better scores?", talk: "يُمْكِنُكَ الْعَوْدَةُ فِي وَقْتٍ لَاحِقٍ لِلْمُسَاعَدَةِ مَرَّةً أُخْرَى وَ سَتَحْصُلُ عَلَى رَصيدٍ أكْبَرَ مِنَ النِّقَاطِ ؟", postmeta: "failgame", voice: "12.mp3" }
                    ],
                TrashSelector_End:
                    [
                        { char: "", en: "Fantastic! With all of these sorted item, our friends can start their project.", talk: "رَائِعٌ ! بَعْدَ فَرْزِ كُلِّ هَذِهِ الْعَنَاصِرِ، سَيَتَمَكَّنُ أَصْدِقَاؤُنَا مِنْ بَدْءِ مَشْرُوعِهِمْ.", voice: "13.mp3" },
                        { char: "", en: "Thank you so much for your help, and we hope you have a good time!", talk: "شُكْراً جَزِيلاً لِمُسَاعَدَتِكَ، وَنَأْمَلُ أَنْ تَكُونَ قَدْ قَضَيْتَ  وَقْتًا مُمْتِعًا مَعَنَا !", postmeta: "endgame", voice: "14.mp3" },
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
export interface HealthTopic {
  id: string;
  icon: string;
  en: {
    label: string;
    keywords: string[];
    summary: string;
    sections: { heading: string; body: string }[];
    prevention?: string[];
  };
  sw: {
    label: string;
    keywords: string[];
    summary: string;
    sections: { heading: string; body: string }[];
    prevention?: string[];
  };
}

export const healthTopics: HealthTopic[] = [
  {
    id: 'infectious-diseases',
    icon: 'Bug',
    en: {
      label: 'Infectious Diseases',
      keywords: ['infectious', 'infection', 'malaria', 'cholera', 'tuberculosis', 'tb', 'typhoid', 'pneumonia', 'diarrhea', 'diarrhoea', 'fever', 'contagious'],
      summary: 'Infectious diseases are caused by pathogens such as bacteria, viruses, fungi, or parasites. Many can be prevented through hygiene, vaccination, and safe practices.',
      sections: [
        {
          heading: 'Malaria',
          body: 'A mosquito-borne disease caused by Plasmodium parasites. Symptoms include high fever, chills, sweating, headache, and body aches. Seek immediate testing if you have a fever in a malaria-endemic area. Treatment with antimalarial drugs is highly effective when started early.',
        },
        {
          heading: 'Tuberculosis (TB)',
          body: 'A bacterial infection that mainly affects the lungs, spread through the air when an infected person coughs or sneezes. Symptoms: persistent cough for 2+ weeks, coughing blood, chest pain, weight loss, night sweats, and fever. TB is fully curable with a 6-month course of medication taken exactly as prescribed.',
        },
        {
          heading: 'Cholera',
          body: 'An intestinal infection from contaminated water or food causing severe watery diarrhea and dehydration. Treatment focuses on rapid rehydration with ORS (oral rehydration salts). Always drink safe, treated water and practice good food hygiene.',
        },
        {
          heading: 'Typhoid Fever',
          body: 'A bacterial infection from contaminated food or water. Symptoms develop over weeks: sustained fever, weakness, stomach pain, headache, and loss of appetite. Diagnosed by blood test and treated with antibiotics. A vaccine is available for travelers and at-risk groups.',
        },
        {
          heading: 'Pneumonia',
          body: 'An infection that inflames air sacs in the lungs, caused by bacteria, viruses, or fungi. Symptoms: cough with phlegm, fever, chills, and difficulty breathing. Vaccines (pneumococcal and Hib) help prevent bacterial forms. Seek care promptly for young children and elderly.',
        },
      ],
      prevention: [
        'Wash hands frequently with soap and clean water for at least 20 seconds',
        'Drink only treated, boiled, or bottled water',
        'Cook food thoroughly and avoid raw foods from unsafe sources',
        'Use mosquito nets and repellents in malaria-endemic areas',
        'Complete all vaccination schedules for children and adults',
        'Cover coughs and sneezes; avoid close contact with sick people',
      ],
    },
    sw: {
      label: 'Magonjwa ya Kuambukizwa',
      keywords: ['kuambukizwa', 'ambukizo', 'malaria', 'kipindupindu', 'kifua kikuu', 'tibi', 'homba', 'homa', 'kuhara', 'maambukizi'],
      summary: 'Magonjwa ya kuambukizwa husababishwa na vimelea kama vile bakteria, virusi, uyoga, au minyoo. Mingi inaweza kuzuiliwa kwa usafi, chanjo, na mazoea salama.',
      sections: [
        {
          heading: 'Malaria',
          body: 'Ugonjwa unaosambazwa na mbu unasababishwa na vimelea vya Plasmodium. Dalili ni pamoja na homa kali, baridi, jasho, kichwa kuuma, na maumivu ya mwili. Pima mara moja ukiwa na homa katika eneo lenye malaria. Matibabu ya dawa za malaria ni madhubuti ikiwa yanaanza mapema.',
        },
        {
          heading: 'Kifua Kikuu (TB)',
          body: 'Maambukizi ya bakteria yanayoathiri mapafu hasa, yanayoenezwa hewani mtu mgonjwa anapokohoa. Dalili: kukohoa kwa zaidi ya wiki 2, kohoa damu, maumivu ya kifua, kupunguza uzito, jasho la usiku, na homa. TB inatibika kwa kozi ya dawa ya miezi 6 iliyochukuliwa kama ilivyoagizwa.',
        },
        {
          heading: 'Kipindupindu',
          body: 'Maambukizi ya matumbo kutoka maji au chakula kilicho na uchafu yanayosababisha kuhara sana na upungufu wa maji mwilini. Matibabu ni maji ya ORS haraka. Kunywa maji yaliyotibiwa na kudumisha usafi wa chakula.',
        },
        {
          heading: 'Homa ya Matumbo',
          body: 'Maambukizi ya bakteria kutoka chakula au maji yasiyo salama. Dalili huendelea kwa wiki: homa endelevu, udhaifu, maumivu ya tumbo, kichwa, na kupoteza hamu ya kula. Hupimwa kwa damu na hutibiwa kwa antibiotiki. Chanjo ipo kwa wasafiri.',
        },
        {
          heading: 'Nimonia',
          body: 'Maambukizi yanayo sababisha mvuli katika mapafu, yanayosababishwa na bakteria, virusi, au uyoga. Dalili: kukohoa makohozi, homa, baridi, na kupumua kwa shida. Chanjo (pneumococcal na Hib) husaidia kuzuia aina za bakteria. Tafuta matibabu haraka kwa watoto na wazee.',
        },
      ],
      prevention: [
        'Osha mikono mara kwa mara kwa sabuni na maji safi kwa angalau sekunde 20',
        'Kunywa maji yaliyotibiwa, yaliyochemshwa, au yaliyotoka kwenye chupa',
        'Pika chakula kikamilifu na epuka vyakula vibichi vya visimu visivyo salama',
        'Tumia vyandarua na dawa za kufuliza mbu katika maeneo yenye malaria',
        'Kamilisha chanjo zote za watoto na watu wazima',
        'Funika mdomo ukikohoa; epuka kuwa karibu na wagonjwa',
      ],
    },
  },
  {
    id: 'cancer',
    icon: 'Ribbon',
    en: {
      label: 'Cancer Awareness',
      keywords: ['cancer', 'tumor', 'tumour', 'chemotherapy', 'mammogram', 'screening', 'oncology', 'lump', 'breast cancer', 'cervical cancer', 'prostate'],
      summary: 'Cancer is the uncontrolled growth of abnormal cells. Early detection through screening greatly improves survival. Many cancers are preventable through lifestyle choices and vaccination.',
      sections: [
        {
          heading: 'Breast Cancer',
          body: 'The most common cancer in women. Signs: a lump or thickening in the breast, change in breast shape or size, nipple discharge, or skin changes. Monthly self-examination and clinical screening (mammogram) after age 40 are key. Early detection has a 90%+ survival rate.',
        },
        {
          heading: 'Cervical Cancer',
          body: 'Caused mainly by persistent HPV (Human Papillomavirus) infection. Preventable with the HPV vaccine (recommended for girls aged 9-14) and regular Pap smear screening. Symptoms: abnormal bleeding, especially after intercourse. Early stages often have no symptoms, so screening is essential.',
        },
        {
          heading: 'Prostate Cancer',
          body: 'Common in men over 50. Symptoms: difficulty urinating, frequent urination at night, blood in urine, pelvic pain. Screening via PSA blood test and physical exam. Early detection leads to effective treatment.',
        },
        {
          heading: 'Warning Signs (CAUTION)',
          body: 'C: Change in bowel or bladder habits. A: A sore that does not heal. U: Unusual bleeding or discharge. T: Thickening or lump in breast or elsewhere. I: Indigestion or difficulty swallowing. O: Obvious change in wart or mole. N: Nagging cough or hoarseness.',
        },
        {
          heading: 'Treatment Options',
          body: 'Treatment depends on cancer type and stage, and may include surgery, chemotherapy, radiation therapy, immunotherapy, or targeted therapy. Our oncology department provides consultations and referrals for comprehensive cancer care.',
        },
      ],
      prevention: [
        'Do not smoke or use tobacco products',
        'Eat a diet rich in fruits, vegetables, and whole grains',
        'Limit alcohol consumption',
        'Maintain a healthy weight and exercise regularly',
        'Get the HPV vaccine (girls 9-14) and hepatitis B vaccine',
        'Attend regular cancer screenings appropriate for your age and gender',
        'Protect your skin from excessive sun exposure',
      ],
    },
    sw: {
      label: 'Ufahamu wa Saratani',
      keywords: ['saratani', 'kimimo', 'chanjo ya saratani', 'saratani ya matiti', 'saratani ya shingo ya kizazi', 'tiba ya saratani'],
      summary: 'Saratani ni ukuaji usio na kudhibitiwa wa seli za ajabu. Ugunduzi wa mapema kupitia uchunguzi huongeza sana uwezekano wa kupona. Saratani nyingi zinaweza kuzuiwa kwa maisha na chanjo.',
      sections: [
        {
          heading: 'Saratani ya Matiti',
          body: 'Saratani inayoambaa zaidi kwa wanawake. Ishara: kimimo au kuziba katika matiti, mabadiliko ya umbo au ukubwa, maji ya kinyonyi, au mabadiliko ya ngozi. Uchunguzi wa kila mwezi na kliniki (mammogram) baada ya miaka 40 ni muhimu. Ugunduzi wa mapema una kiwango cha zaidi ya 90% cha kupona.',
        },
        {
          heading: 'Saratani ya Shingo ya Kizazi',
          body: 'Inayosababishwa hasa na maambukizi ya HPV (Virusi vya Papilloma ya Binadamu). Inaweza kuzuiwa kwa chanjo ya HPV (inashauriwa kwa wasichana wenye umri wa miaka 9-14) na uchunguzi wa kawaida wa Pap smear. Dalili: kutokwa na damu isiyo kawaida, hasa baada ya kujamiiana. Hatua za mapema mara nyingi hazina dalili, kwa hivyo uchunguzi ni muhimu.',
        },
        {
          heading: 'Saratani ya Tezi dume',
          body: 'Inatokea kwa wanaume zaidi ya miaka 50. Dalili: kukojoa kwa shida, kukojoa mara kwa mara usiku, damu kwenye mkojo, maumivu ya pelvis. Uchunguzi kupitia kipimo cha damu cha PSA na uchunguzi wa mwili. Ugunduzi wa mapema husababisha matibabu madhubuti.',
        },
        {
          heading: 'Ishara za Onyo',
          body: 'Mabadiliko ya tabia za choo au kibofu. Kidonda kisichopona. Kutokwa na damu isiyo kawaida. Kimimo au nene katika matiti. Utumbo wa chakula au shida ya kumeza. Mabadiliko ya wazi kwenye njiwa. Kikohozi kisichoisha.',
        },
        {
          heading: 'Chaguo za Matibabu',
          body: 'Matibabu yanategemea aina na hatua ya saratani, na yanaweza kujumuisha upasuaji, kemotherapi, tiba ya mnururisho, tiba ya kinga, au tiba lengwa. Idara yetu ya oncology inatoa ushauri na rufaa kwa huduma kamili ya saratani.',
        },
      ],
      prevention: [
        'Usivute sigara au kutumia bidhaa za tumbaku',
        'Kula chakula chenye matunda, mboga, na nafaka nzima',
        'Punguza unywaji pombe',
        'Endeleza uzito wa afya na mazoezi ya kawaida',
        'Pata chanjo ya HPV (wasichana 9-14) na chanjo ya homa ya ini B',
        'Hudhuria uchunguzi wa kawaida wa saratani kufa na umri na jinsia',
        'Linda ngozi yako kutoka jua la kupita kiasi',
      ],
    },
  },
  {
    id: 'hiv',
    icon: 'HeartPulse',
    en: {
      label: 'HIV & AIDS',
      keywords: ['hiv', 'aids', 'arvs', 'antiretroviral', 'immune system', 'cd4', 'viral load', 'prep', 'pep', 'condom', 'std', 'sti'],
      summary: 'HIV is a virus that attacks the immune system. With proper treatment (ARVs), people with HIV live long, healthy lives and can prevent transmission to partners and babies.',
      sections: [
        {
          heading: 'What is HIV?',
          body: 'HIV (Human Immunodeficiency Virus) attacks CD4 cells that help the immune system fight infections. Without treatment, HIV progresses to AIDS (Acquired Immunodeficiency Syndrome). With antiretroviral therapy (ART), the virus can be suppressed to undetectable levels.',
        },
        {
          heading: 'How HIV is Transmitted',
          body: 'HIV is transmitted through: unprotected sex, contact with infected blood (sharing needles, unsafe transfusions), and mother-to-child during pregnancy, birth, or breastfeeding. It is NOT transmitted by hugging, sharing food, mosquito bites, or toilet seats.',
        },
        {
          heading: 'Testing & Diagnosis',
          body: 'HIV is diagnosed with a simple blood test. Everyone should know their status. Testing is free and confidential at our clinic and many health centers. Rapid test results are available in 15-20 minutes.',
        },
        {
          heading: 'Treatment (ARVs)',
          body: 'Antiretroviral drugs (ARVs) stop HIV from multiplying, allowing the immune system to recover. ARVs must be taken every day for life. "Undetectable = Untransmittable": when the viral load is undetectable, HIV cannot be transmitted through sex.',
        },
        {
          heading: 'Prevention: PrEP & PEP',
          body: 'PrEP (Pre-Exposure Prophylaxis): a daily pill for people at higher risk that prevents HIV infection, taken before exposure. PEP (Post-Exposure Prophylaxis): emergency medication taken within 72 hours of possible exposure, for 28 days. Both are available at our clinic.',
        },
        {
          heading: 'Living with HIV',
          body: 'With ARVs, regular check-ups, good nutrition, and a healthy lifestyle, people with HIV live long, full lives. Stigma and discrimination are harmful and unnecessary. Support your loved ones living with HIV.',
        },
      ],
      prevention: [
        'Use condoms correctly every time you have sex',
        'Get tested regularly and know your status',
        'Take PrEP daily if you are at higher risk',
        'Access PEP within 72 hours if exposed',
        'Never share needles or sharp objects',
        'Pregnant women with HIV receive treatment to protect the baby',
        'Encourage partners to get tested and treated together',
      ],
    },
    sw: {
      label: 'VVU na UKIMWI',
      keywords: ['vvu', 'ukimwi', 'arv', 'dawa za kukinga', 'kinga mwili', 'upimaji', 'kondomu', 'maambukizi'],
      summary: 'VVU ni virusi vinavyoshambulia mfumo wa kinga. Kwa matibabu sahihi (ARV), watu wenye VVU wanaishi maisha marefu na ya afya, na wanaweza kuzuia maambukizi kwa wenza na watoto.',
      sections: [
        {
          heading: 'VVU ni Nini?',
          body: 'VVU (Virusi vya Upungufu wa Kinga) vinashambulia seli za CD4 zinazosaidia mfumo wa kinga. Bila matibabu, VVU hupelekea UKIMWI. Kwa tiba ya ARV, virusi vinaweza kudhibitiwa kiwango kisichogundika.',
        },
        {
          heading: 'Jinsi VVU Vinavyoambukizwa',
          body: 'VVU hupitishwa kupitia: ngoma bila kinga, kuwa na damu iliyoambukizwa (kushiriki sindano, damu isiyo salama), na kutoka mama kwenda mtoto wakati wa ujauzito, kuzaliwa, au kunyonyesha. HAVIAMBUKIZWI kwa kukumbatiana, kushiriki chakula, kung\u2019atwa mbu, au viti chooni.',
        },
        {
          heading: 'Upimaji na Utambuzi',
          body: 'VVU hutambulishwa kwa kipimo rahisi cha damu. Kila mtu anapaswa kujua hali yake. Upimaji ni bure na siri katika kliniki yetu na vituo vingi vya afya. Matokeo ya kipimo cha haraka yapatikani kwa dakika 15-20.',
        },
        {
          heading: 'Matibabu (ARV)',
          body: 'Dawa za ARV zinazuia VVU kuzaliana, kuruhusu mfumo wa kinga kurejesha. ARV lazima zichukuliwe kila siku maisha yote. "Haigunduliki = Haambukizi": wakati wingi wa virusi haugunduliki, VVU haviwezi kuambukizwa kupitia ngono.',
        },
        {
          heading: 'Kuzuia: PrEP na PEP',
          body: 'PrEP (Kinga kabla ya kuambukizwa): dawa ya kila siku kwa watu wenye hatari kubwa inayozuia maambukizi ya VVU, huchukuliwa kabla ya kukabiliwa. PEP (Kinga baada ya kuambukizwa): dawa ya dharura inayochukuliwa ndani ya saa 72 baada ya kuwezekana kuambukizwa, kwa siku 28. Zote zinapatikana kliniki kwetu.',
        },
        {
          heading: 'Kuishi na VVU',
          body: 'Kwa ARV, uchunguzi wa kawaida, lishe nzuri, na maisha ya afya, watu wenye VVU wanaishi maisha marefu. Ubaguzi na kudharauliwa ni hatari na havitajiwi. Saidia wapendwa wako wanaoishi na VVU.',
        },
      ],
      prevention: [
        'Tumia kondomu kwa usahihi kila wakati unapofanya ngono',
        'Pimwa mara kwa mara na ujue hali yako',
        'Chukua PrEP kila siku ukiwa na hatari kubwa',
        'Pata PEP ndani ya saa 72 ukiwa umekabiliwa',
        'Usishiriki sindano au vitu vikali',
        'Wajawazito wenye VVU wanapata matibabu kulinda mtoto',
        'Mshauri mwenza wako apimwe na atibiwe pamoja',
      ],
    },
  },
  {
    id: 'womens-health',
    icon: 'Flower2',
    en: {
      label: "Women's Health",
      keywords: ['women', 'pregnancy', 'maternal', 'menstruation', 'period', 'menopause', 'antenatal', 'prenatal', 'postnatal', 'cervical', 'breast', 'reproductive', 'fertility', 'pap smear'],
      summary: "Women's health covers reproductive health, pregnancy care, menstrual health, menopause, and screenings. Regular check-ups help detect and prevent serious conditions early.",
      sections: [
        {
          heading: 'Antenatal Care (Pregnancy)',
          body: 'Attend at least 4 antenatal visits during pregnancy. First visit should be in the first trimester. Checks include blood pressure, weight, blood tests (HIV, syphilis, anemia), and fetal monitoring. Take folic acid daily from before conception through pregnancy to prevent birth defects.',
        },
        {
          heading: 'Safe Delivery',
          body: 'Deliver at a health facility with skilled birth attendants. This greatly reduces risks for both mother and baby. Know the danger signs during labor: severe bleeding, prolonged labor, high fever, or loss of consciousness. Call for emergency help immediately.',
        },
        {
          heading: 'Postnatal Care',
          body: 'After delivery, attend postnatal check-ups at 6 hours, 3 days, 7 days, and 6 weeks. Watch for danger signs: heavy bleeding, fever, severe headache, blurred vision, or swollen legs (signs of pre-eclampsia). Exclusive breastfeeding is recommended for the first 6 months.',
        },
        {
          heading: 'Menstrual Health',
          body: 'Normal cycles are 21-35 days lasting 2-7 days. See a doctor if you experience: very heavy bleeding, severe pain, irregular cycles, or bleeding between periods. Menstrual hygiene is important: use clean sanitary products and change every 4-6 hours.',
        },
        {
          heading: 'Menopause',
          body: 'Natural transition usually between ages 45-55 when periods stop. Symptoms: hot flashes, night sweats, mood changes, sleep problems, and vaginal dryness. Healthy lifestyle, calcium, and vitamin D help manage symptoms and protect bones. Consult a doctor for treatment options.',
        },
        {
          heading: 'Family Planning',
          body: 'Various methods available: pills, injections, implants, IUDs, condoms, and natural methods. Each has benefits and considerations. Our clinic provides confidential family planning counseling. Spacing pregnancies by at least 2 years improves maternal and child health.',
        },
      ],
      prevention: [
        'Attend all antenatal visits during pregnancy',
        'Take folic acid and iron supplements as prescribed',
        'Deliver at a health facility with skilled attendants',
        'Practice exclusive breastfeeding for the first 6 months',
        'Get regular Pap smears and breast examinations',
        'Use family planning to space pregnancies',
        'Maintain good menstrual hygiene',
      ],
    },
    sw: {
      label: 'Afya ya Wanawake',
      keywords: ['wanawake', 'mimba', 'ujauzito', 'hedhi', 'npshonjaa', 'baada ya kujifungua', 'uzazi', 'afya ya uzazi', 'familia'],
      summary: 'Afya ya wanawake huhusu afya ya uzazi, huduma ya ujauzito, afya ya hedhi, npshonjaa, na uchunguzi. Uchunguzi wa kawaida husaidia kugundua na kuzuia magonjwa mapema.',
      sections: [
        {
          heading: 'Huduma Wakati wa Ujauzito',
          body: 'Hudhuria angalau ziara 4 wakati wa ujauzito. Ziara ya kwanza iwe katika kipindi cha kwanza cha miezi mitatu. Vipimo ni pamoja na shinikizo la damu, uzito, vipimo vya damu (VVU, kaswende, upungufu wa damu), na ufuatiliaji wa mtoto. Chukua asidi ya folic kila siku tangu kabla ya kupata mimba hadi kujifungua.',
        },
        {
          heading: 'Kujifungua Salama',
          body: 'Jifungue katika kituo cha afya chenye watoa huduma wenye ujuzi. Hii inapunguza sana hatari kwa mama na mtoto. Jua ishara za hatari wakati wa kujifungua: kutokwa damu nyingi, uchungu wa kuingia sana, homa kali, au kupoteza fahamu. Piga simu ya dharura mara moja.',
        },
        {
          heading: 'Huduma Baada ya Kujifungua',
          body: 'Baada ya kujifungua, hudhuria uchunguzi saa 6, siku 3, siku 7, na wiki 6. Angalia ishara za hatari: kutokwa damu nyingi, homa, kichwa kali, kuona kwa shida, au miguu kuvimba (ishara za pre-eclampsia). Unyonyeshaji wa pekee unashauriwa kwa miezi 6 ya kwanza.',
        },
        {
          heading: 'Afya ya Hedhi',
          body: 'Mizunguko ya kawaida ni siku 21-35 ikidumu siku 2-7. Muone daktari ukiwa na: kutokwa damu nyingi sana, maumivu makali, mizunguko isiyo ya kawaida, au kutokwa damu kati ya hedhi. Usafi wa hedhi ni muhimu: tumia bidhaa safi na zibadilishe kila saa 4-6.',
        },
        {
          heading: 'Npshonjaa',
          body: 'Mabadiliko ya asili kwa kawaida kati ya umri wa miaka 45-55 hedhi inaposimama. Dalili: joto la ghafla, jasho la usiku, mabadiliko ya hisia, shida ya usingizi, na ukavu wa uke. Maisha ya afya, kalshiamu, na vitamini D husaidia. Muone daktari kwa chaguo za matibabu.',
        },
        {
          heading: 'Uzazi wa Mpango',
          body: 'Njia mbalimbali zinapatikana: vidonge, sindano, vipandikizi, IUD, kondomu, na njia za asili. Kila moja ina faida na mambo ya kuzingatia. Kliniki yetu inatoa ushauri wa siri. Kuacha mimba kwa angalau miaka 2 huboresha afya ya mama na mtoto.',
        },
      ],
      prevention: [
        'Hudhuria ziara zote za ujauzito',
        'Chukua asidi ya folic na chuma kama ilivyoagizwa',
        'Jifungue katika kituo cha afya chenye watoa huduma wenye ujuzi',
        'Fanya unyonyeshaji wa pekee kwa miezi 6 ya kwanza',
        'Fanya uchunguzi wa kawaida wa Pap smear na matiti',
        'Tumia uzazi wa mpango kupanga mimba',
        'Dumisha usafi mzuri wa hedhi',
      ],
    },
  },
  {
    id: 'blood-pressure',
    icon: 'Activity',
    en: {
      label: 'Blood Pressure & Heart',
      keywords: ['blood pressure', 'hypertension', 'heart', 'cardiovascular', 'stroke', 'cholesterol', 'bp', 'sugar', 'diabetes'],
      summary: 'High blood pressure (hypertension) and diabetes are "silent killers" because they often have no symptoms until serious damage occurs. Regular screening and lifestyle changes can prevent complications.',
      sections: [
        {
          heading: 'High Blood Pressure (Hypertension)',
          body: 'Normal BP is below 120/80 mmHg. Hypertension is 140/90 or higher. Most people have no symptoms until complications arise. Untreated hypertension causes stroke, heart attack, kidney failure, and blindness. Have your BP checked at least once a year.',
        },
        {
          heading: 'Diabetes',
          body: 'A condition where blood sugar is too high. Type 2 (most common) is linked to lifestyle. Symptoms: excessive thirst, frequent urination, unexplained weight loss, fatigue, and blurred vision. Normal fasting blood sugar is 70-100 mg/dL. Diabetes is manageable with diet, exercise, and medication.',
        },
        {
          heading: 'Stroke Warning Signs (FAST)',
          body: 'F: Face drooping on one side. A: Arm weakness - cannot raise both arms. S: Speech difficulty - slurred or confused. T: Time - call emergency immediately. Every minute counts in stroke treatment.',
        },
        {
          heading: 'Heart Disease',
          body: 'Risk factors: high blood pressure, diabetes, smoking, obesity, poor diet, and physical inactivity. Warning signs: chest pain or pressure, shortness of breath, pain radiating to arm or jaw, nausea, and cold sweat. Seek emergency care immediately if these occur.',
        },
        {
          heading: 'Cholesterol',
          body: 'High cholesterol builds up in arteries, increasing heart attack and stroke risk. Tested with a simple blood test. Reduce saturated fats (fatty meat, butter), eat more fiber (oats, beans, fruits), and exercise regularly.',
        },
      ],
      prevention: [
        'Reduce salt intake - less than 1 teaspoon per day',
        'Eat more fruits, vegetables, and whole grains',
        'Exercise at least 30 minutes, 5 days a week',
        'Maintain a healthy weight',
        'Limit alcohol and do not smoke',
        'Check blood pressure and blood sugar annually',
        'Take prescribed medications consistently',
        'Manage stress through relaxation and adequate sleep',
      ],
    },
    sw: {
      label: 'Shinikizo la Damu na Moyo',
      keywords: ['shinikizo la damu', 'moyo', 'kisukari', 'sukari', ' kolesteroli', 'kiharusi'],
      summary: 'Shinikizo la damu na kisukari ni "wauaji wa kimya" kwa sababu mara nyingi hayana dalili hadi uharibifu mkubwa kutokee. Uchunguzi wa kawaida na mabadiliko ya maisha yanaweza kuzuia matatizo.',
      sections: [
        {
          heading: 'Shinikizo la Damu',
          body: 'BP ya kawaida ni chini ya 120/80 mmHg. Shinikizo la juu ni 140/90 au zaidi. Watu wengi hawana dalili hadi matatizo. Bila tiba husababisha kiharusi, heart attack, kushindwa kwa figo, na upofu. Pimwa BP angalau mara moja kwa mwaka.',
        },
        {
          heading: 'Kisukari',
          body: 'Hali ambayo sukari ya damu ni juu sana. Aina ya 2 (inayoambaa zaidi) inahusiana na maisha. Dalili: kiu sana, kojoa mara kwa mara, kupunguza uzito bila sababu, uchovu, na kuona kwa shida. Sukari ya kawaida ya kufunga ni 70-100 mg/dL. Kisukari kinadhibitiwa kwa chakula, mazoezi, na dawa.',
        },
        {
          heading: 'Ishara za Kiharusi (FAST)',
          body: 'F: Uso unashuka upande mmoja. A: Udhaifu wa mkono - hawezi kuinua mikono yote. S: Shida ya kuongea - maneno yanachanganya. T: Wakati - piga simu ya dharura mara moja. Kila dakika ni muhimu katika tiba ya kiharusi.',
        },
        {
          heading: 'Magonjwa ya Moyo',
          body: 'Hatari: shinikizo la damu, kisukari, uvutaji sigara, unene, chakula mbaya, na ukosefu wa mazoezi. Ishara: maumivu ya kifua, kupumua kwa shida, maumivu kwenda mkono au taya, kichefuchefu, na jasho baridi. Tafuta matibabu ya dharura mara moja.',
        },
        {
          heading: 'Kolesteroli',
          body: 'Kolesteroli ya juu hujiliza katika mishipa ya damu, kuongeza hatari ya heart attack na kiharusi. Hupimwa kwa kipimo rahisi cha damu. Punguza mafuta yaliyoshindiwawa (nyama yenye mafuta, siagi), kula nyuzi nyingi (ngano, maharage, matunda), na fanya mazoezi.',
        },
      ],
      prevention: [
        'Punguza chumvi - chini ya kijiko kimoja kwa siku',
        'Kula matunda, mboga, na nafaka nzima zaidi',
        'Fanya mazoezi angalau dakika 30, siku 5 kwa wiki',
        'Endeleza uzito wa afya',
        'Punguza pombe na usivute sigara',
        'Pima shinikizo la damu na sukari kila mwaka',
        'Chukua dawa zilizoagizwa kwa uthabiti',
        'Dhibiti msongo wa fikra kupitia mapumziko na usingizi wa kutosha',
      ],
    },
  },
  {
    id: 'nutrition',
    icon: 'Apple',
    en: {
      label: 'Nutrition & Food',
      keywords: ['nutrition', 'food', 'diet', 'eating', 'vitamin', 'nutrient', 'malnutrition', 'anemia', 'iron', 'protein', 'calorie', 'healthy eating', 'balanced diet', 'vitamin a'],
      summary: 'Good nutrition means eating a variety of foods that provide energy, protein, vitamins, and minerals. A balanced diet prevents malnutrition, anemia, and chronic diseases.',
      sections: [
        {
          heading: 'A Balanced Plate',
          body: 'Fill half your plate with vegetables and fruits, a quarter with starchy foods (rice, ugali, potatoes, cassava), and a quarter with protein (fish, beans, eggs, meat, milk). Add a small amount of healthy fats and drink plenty of clean water.',
        },
        {
          heading: 'Key Nutrients',
          body: 'Protein: builds and repairs body tissue (beans, fish, eggs, meat, milk). Iron: prevents anemia (dark leafy greens, liver, beans - eat with vitamin C like citrus for better absorption). Vitamin A: protects eyes and immune system (carrots, sweet potatoes, mango, liver). Calcium: builds strong bones (milk, small fish with bones, dark greens).',
        },
        {
          heading: 'Preventing Anemia',
          body: 'Anemia (low blood) causes fatigue, weakness, pale skin, and dizziness. Common in women and children. Prevent it by eating iron-rich foods (spinach, liver, beans, meat) with vitamin C foods (oranges, tomatoes). Pregnant women should take iron supplements as prescribed.',
        },
        {
          heading: 'Child Nutrition',
          body: 'Exclusive breastfeeding for the first 6 months. Start complementary foods at 6 months while continuing breastfeeding to 2 years. Give children a variety of foods: mashed vegetables, eggs, fish, beans, and fruits. Vitamin A supplementation every 6 months for children 6-59 months.',
        },
        {
          heading: 'Food Safety',
          body: 'Wash hands before preparing food and eating. Wash fruits and vegetables thoroughly. Cook food, especially meat and eggs, fully. Store food properly, refrigerate leftovers within 2 hours. Reheat food until steaming hot. Avoid expired or moldy food.',
        },
        {
          heading: 'Healthy Eating Habits',
          body: 'Limit sugar and sugary drinks. Limit salt and processed foods. Choose healthy snacks (fruit, nuts) over chips and sweets. Eat regular meals - do not skip breakfast. Drink 6-8 glasses of clean water daily. Limit deep-fried foods.',
        },
      ],
      prevention: [
        'Eat at least 5 servings of fruits and vegetables daily',
        'Choose whole grains over refined foods',
        'Include protein in every meal from varied sources',
        'Limit sugar, salt, and deep-fried foods',
        'Drink 6-8 glasses of clean water daily',
        'Practice safe food handling and storage',
        'Take iron and folic acid supplements during pregnancy',
        'Breastfeed exclusively for 6 months; continue to 2 years',
      ],
    },
    sw: {
      label: 'Lishe na Chakula',
      keywords: ['lishe', 'chakula', 'vyakula', 'vitamini', 'madini', 'utapiamlo', 'upungufu wa damu', 'chuma', 'protini', 'chakula bora'],
      summary: 'Lishe njema inamaanisha kula vyakula mbalimbali vinavyotoa nguvu, protini, vitamini, na madini. Chakula bora kinazuia utapiamlo, upungufu wa damu, na magonjwa ya muda mrefu.',
      sections: [
        {
          heading: 'Sahani ya Wenye Usawa',
          body: 'Jaza nusu ya sahani kwa mboga na matunda, robo na vyakula vyenye wanga (mchele, ugali, viazi, muhogo), na robo na protini (samaki, maharage, mayai, nyama, maziwa). Ongeza mafuta kidogo na kunywa maji safi mengi.',
        },
        {
          heading: 'Virutubisho Muhimu',
          body: 'Protini: hujenga na kurekebisha mwili (maharage, samaki, mayai, nyama, maziwa). Chuma: kinazuia upungufu wa damu (mboga za majani, ini, maharage - kula na vitamini C kama machungwa). Vitamini A: kulinda macho na kinga (karoti, viazi vitamu, embe, ini). Kalshiamu: hujenga mifupa imara (maziwa, samaki wadogo na mifupa, mboga za majani).',
        },
        {
          heading: 'Kuzuia Upungufu wa Damu',
          body: 'Upungufu wa damu husababisha uchovu, udhaifu, ngozi nyepesi, na kizunguzungu. Huutokea kwa wanawake na watoto. Zuia kwa kula vyakula vyenye chuma (mboga, ini, maharage, nyama) na vyakula vya vitamini C (machungwa, nyanya). Wajawazito wachukue dawa za chuma kama ilivyoagizwa.',
        },
        {
          heading: 'Lishe ya Watoto',
          body: 'Unyonyeshaji wa pekee kwa miezi 6 ya kwanza. Anza vyakula vya nyongeza miezi 6 huku ukiendelea kunyonyesha hadi miaka 2. Watoto wapewe vyakula mbalimbali: mboga zilizopondwa, mayai, samaki, maharage, na matunda. Vitamini A kila miezi 6 kwa watoto wa miezi 6-59.',
        },
        {
          heading: 'Usalama wa Chakula',
          body: 'Osha mikono kabla ya kuandaa chakula na kula. Osha matunda na mboga vizuri. Pika chakula, hasa nyama na mayai, kikamilifu. Hifadhi chakula kwa usahihi, weka kwenye friji ndani ya saa 2. Joto tena hadi chakula kiive. Epuka chakula kilichoisha au kilicho na ukung\u2019u.',
        },
        {
          heading: 'Mazoea ya Kula ya Afya',
          body: 'Punguza sukari na vinywaji vyenye sukari. Punguza chumvi na vyakula vilivyosindikwa. Chagua vitafunio vya afya (matunda, karanga) kulisha chips na peremende. Kula milo ya kawaida - usiruke chakula cha asubuhi. Kunywa glasi 6-8 za maji safi kila siku. Punguza vyakula vilivyokaangwa sana.',
        },
      ],
      prevention: [
        'Kula angalau seva 5 za matunda na mboga kila siku',
        'Chagua nafaka nzima kuliko vyakula vilivyosafishwa',
        'Hakikisha protini kwenye kila mlo kutoka vyanzo mbalimbali',
        'Punguza sukari, chumvi, na vyakula vilivyokaangwa sana',
        'Kunywa glasi 6-8 za maji safi kila siku',
        'Fanya usimamizi salama wa chakula na uhifadhi',
        'Chukua dawa za chuma na asidi ya folic wakati wa ujauzito',
        'Nyonyesha kwa pekee kwa miezi 6; endelea hadi miaka 2',
      ],
    },
  },
  {
    id: 'disease-prevention',
    icon: 'ShieldCheck',
    en: {
      label: 'Disease Prevention',
      keywords: ['prevent', 'prevention', 'avoid', 'protect', 'vaccine', 'vaccination', 'immunization', 'hygiene', 'sanitation', 'healthy lifestyle', 'immunity'],
      summary: 'Preventing disease is better than curing it. Simple daily habits, vaccination, good hygiene, and a healthy lifestyle protect you and your family from many illnesses.',
      sections: [
        {
          heading: 'Vaccination (Immunization)',
          body: 'Vaccines train your immune system to fight diseases before they occur. Children should complete all scheduled vaccines: BCG (TB), polio, DPT (diphtheria, pertussis, tetanus), measles, rotavirus, pneumococcal, and HPV (for girls 9-14). Adults need tetanus boosters and may need flu, hepatitis, and COVID-19 vaccines.',
        },
        {
          heading: 'Hand Hygiene',
          body: 'Handwashing is the single most effective way to prevent infections. Wash with soap and clean water for 20 seconds: after using the toilet, before eating, before preparing food, after coughing or sneezing, and after handling animals. Use hand sanitizer if soap is unavailable.',
        },
        {
          heading: 'Water & Sanitation',
          body: 'Drink only safe water: boiled, filtered, chlorinated, or bottled. Store water in clean, covered containers. Use toilets or latrines, not open defecation. Wash fruits and vegetables with safe water. These practices prevent cholera, typhoid, diarrhea, and parasites.',
        },
        {
          heading: 'Food Safety',
          body: 'Cook food thoroughly, especially meat, poultry, and eggs. Separate raw and cooked foods to avoid cross-contamination. Store at proper temperatures. Wash hands and surfaces often. These prevent food poisoning, typhoid, and other food-borne diseases.',
        },
        {
          heading: 'Safe Sex Practices',
          body: 'Use condoms correctly to prevent HIV, STIs, and unintended pregnancy. Get tested regularly for HIV and STIs. Limit sexual partners. Seek treatment immediately if you notice any STI symptoms (sores, discharge, pain). Vaccinate against HPV and hepatitis B.',
        },
        {
          heading: 'Building Strong Immunity',
          body: 'A strong immune system fights infections naturally. Boost it by: eating a balanced diet, sleeping 7-9 hours, exercising regularly, managing stress, staying hydrated, and avoiding smoking and excessive alcohol. Breastfeeding builds babies\' immunity.',
        },
      ],
      prevention: [
        'Complete all childhood and adult vaccinations',
        'Wash hands frequently with soap and clean water',
        'Drink only treated, safe water',
        'Cook food thoroughly and store properly',
        'Use condoms and get tested for HIV/STIs',
        'Sleep 7-9 hours and manage stress',
        'Exercise regularly and eat a balanced diet',
        'Keep your environment clean and use toilets properly',
      ],
    },
    sw: {
      label: 'Kuzuia Magonjwa',
      keywords: ['kuzuia', 'uzuiaji', 'chanjo', 'usafi', 'kinga', 'mfumo wa kinga', 'maisha ya afya', 'hifadhi'],
      summary: 'Kuzuia ugonjwa ni bora kuliko kutibu. Mazoea rahisi ya kila siku, chanjo, usafi mzuri, na maisha ya afya hukulinda wewe na familia yako kutoka magonjwa mengi.',
      sections: [
        {
          heading: 'Chanjo (Kinga)',
          body: 'Chanjo hufunza mfumo wako wa kinga kupambana na magonjwa kabla hayajatokea. Watoto wakamilishe chanjo zote: BCG (TB), polio, DPT (diphtheria, pertussis, tetanasi), surua, rotavirus, pneumococcal, na HPV (kwa wasichana 9-14). Watu wazima wanahitaji chanjo ya tetanasi na wanaweza kuhitaji chanjo ya mafua, homa ya ini, na COVID-19.',
        },
        {
          heading: 'Usafi wa Mikono',
          body: 'Kuosha mikono ni njia yenye madhubuti zaidi ya kuzuia maambukizi. Osha kwa sabuni na maji safi kwa sekunde 20: baada ya kutumia choo, kabla ya kula, kabla ya kuandaa chakula, baada ya kukohoa au kupiga chafya, na baada ya kushika wanyama. Tumia sanitizer ikiwa sabuni haipo.',
        },
        {
          heading: 'Maji na Usafi wa Mazingira',
          body: 'Kunywa maji salama tu: yaliyochemshwa, yaliyochujwa, yaliyo na klori, au yaliyo kwenye chupa. Hifadhi maji kwenye vyombo safi, vilivyofunikwa. Tumia vyoo, usitumie choo wazi. Osha matunda na mboga kwa maji salama. Hii inazuia kipindupindu, homa ya matumbo, kuhara, na minyoo.',
        },
        {
          heading: 'Usalama wa Chakula',
          body: 'Pika chakula kikamilifu, hasa nyama, kuku, na mayai. Tenganisha chakula cha mbichi na kilichopikwa. Hifadhi kwa joto sahihi. Osha mikono na uso mara kwa mara. Hii inazuia sumu ya chakula, homa ya matumbo, na magonjwa mengine ya chakula.',
        },
        {
          heading: 'Mazoea Salama ya Ngono',
          body: 'Tumia kondomu kwa usahihi kuzuia VVU, magonjwa ya zinaa, na mimba isiyokusudiwa. Pimwa mara kwa mara VVU na magonjwa ya zinaa. Punguza wenza wa ngono. Tafuta matibabu mara moja ukiwa na dalili za zinaa (vidonda, maji, maumivu). Chanjo dhidi ya HPV na homa ya ini B.',
        },
        {
          heading: 'Kujenga Kinga Imara',
          body: 'Mfumo imara wa kinga hupambana na maambukizi kwa asili. Boresha kwa: kula chakula bora, kulala saa 7-9, mazoezi ya kawaida, kudhibiti msongo, kunywa maji ya kutosha, na kuepuka sigara na pombe kupita kiasi. Unyonyeshaji hujenga kinga ya watoto.',
        },
      ],
      prevention: [
        'Kamilisha chanjo zote za watoto na watu wazima',
        'Osha mikono mara kwa mara kwa sabuni na maji safi',
        'Kunywa maji yaliyotibiwa tu na salama',
        'Pika chakula kikamilifu na hifadhi kwa usahihi',
        'Tumia kondomu na pimwa VVU/magonjwa ya zinaa',
        'Lala saa 7-9 na dhibiti msongo wa fikra',
        'Fanya mazoezi ya kawaida na kula chakula bora',
        'Weka mazingira yako safi na tumia vyoo kwa usahihi',
      ],
    },
  },
  {
    id: 'non-communicable-diseases',
    icon: 'HeartPulse',
    en: {
      label: 'Non-Communicable Diseases',
      keywords: ['non-communicable', 'ncd', 'chronic', 'asthma', 'epilepsy', 'sickle cell', 'sickle-cell', 'mental health', 'depression', 'anxiety', 'kidney disease', 'liver disease', 'cirrhosis', 'arthritis', 'chronic disease'],
      summary: 'Non-communicable diseases (NCDs) are chronic conditions that are not passed from person to person. They develop slowly and often last a lifetime. Early detection, lifestyle changes, and regular treatment can manage them effectively.',
      sections: [
        {
          heading: 'Asthma',
          body: 'A chronic lung condition where airways narrow and swell, causing wheezing, coughing, chest tightness, and shortness of breath. Triggers include dust, smoke, pollen, cold air, and exercise. Treatment: inhalers (relievers for attacks, preventers for daily use). Avoid known triggers and always carry your reliever inhaler.',
        },
        {
          heading: 'Epilepsy',
          body: 'A neurological disorder causing recurrent seizures due to abnormal brain activity. Seizures vary from brief staring spells to convulsions. Treatment: anti-epileptic medications taken consistently. During a seizure: do not restrain the person, protect their head, turn them on their side, and do not put anything in their mouth. Seek medical help if a seizure lasts over 5 minutes.',
        },
        {
          heading: 'Sickle Cell Disease',
          body: 'An inherited blood disorder where red blood cells become rigid and sickle-shaped, blocking blood flow and causing pain crises, anemia, and organ damage. Common in sub-Saharan Africa. Treatment: folic acid supplements, pain management during crises, hydration, and routine vaccinations. Newborn screening is important. Genetic counseling helps couples understand risks.',
        },
        {
          heading: 'Mental Health',
          body: 'Mental health conditions like depression and anxiety are common and treatable. Depression: persistent sadness, loss of interest, fatigue, sleep changes, and thoughts of self-harm. Anxiety: excessive worry, restlessness, panic attacks, and physical symptoms like rapid heartbeat. Treatment includes counseling, medication, and support. Seek help early — mental illness is not a weakness.',
        },
        {
          heading: 'Chronic Kidney Disease',
          body: 'Gradual loss of kidney function, often caused by uncontrolled diabetes or hypertension. Symptoms appear late: swelling of legs, fatigue, changes in urination, nausea. Prevention: control blood sugar and blood pressure, avoid excessive painkiller use, drink adequate water, and get regular kidney function tests if at risk.',
        },
        {
          heading: 'Arthritis',
          body: 'Inflammation of joints causing pain, stiffness, and reduced movement. Osteoarthritis (wear and tear) and rheumatoid arthritis (autoimmune) are most common. Management: weight control, regular gentle exercise, physiotherapy, and anti-inflammatory medications. Joint protection techniques and assistive devices help daily activities.',
        },
      ],
      prevention: [
        'Maintain a healthy diet rich in fruits, vegetables, and whole grains',
        'Exercise regularly — at least 30 minutes, 5 days a week',
        'Avoid tobacco and limit alcohol consumption',
        'Get regular health check-ups to detect conditions early',
        'Take prescribed medications consistently and never skip doses',
        'Manage stress through relaxation, social support, and adequate sleep',
        'Know your family history and discuss risk factors with your doctor',
      ],
    },
    sw: {
      label: 'Magonjwa Yasiyoambukizwa',
      keywords: ['magonjwa yasiyoambukizwa', 'yasiyo ambukizwa', 'asthma', 'pumufupi', 'kifafa', 'epilepsia', 'seli mundu', 'sickle cell', 'afya ya akili', 'unyogovu', 'wasiwasi', 'figo', 'ini', 'maungo'],
      summary: 'Magonjwa yasiyoambukizwa ni magonjwa ya muda mrefu ambayo hayasambazwi kutoka mtu hadi mtu. Huyaendelea polepole na mara nyingi hudumu maisha yote. Ugunduzi wa mapema, mabadiliko ya maisha, na matibabu ya kawaida yanaweza kuyadhibiti.',
      sections: [
        {
          heading: 'Asthma (Pumufupi)',
          body: 'Hali ya muda mrefu ya mapafu ambayo njia za hewa zinavyaa na kuvimba, ikisababisha mdudu wa kupumua, kukohoa, shinikizo la kifua, na kupumua kwa shida. Visababishi ni pamoja na vumbi, moshi, chavua, baridi, na mazoezi. Matibabu: pampu (za kupunguza shambulio na za kuzuia). Epuka visababishi na daima bebaka pampu yako.',
        },
        {
          heading: 'Kifafa (Epilepsy)',
          body: 'Ugonjwa wa neva unaosababisha mtetemo unaojirudia kutokana na shughuli za ajabu za ubongo. Mtetemo hutofautiana kutoka kuartu macho kwa muda mfupi hadi mtetemo wa mwili. Matibabu: dawa za kuzuia kifafa zinazochukuliwa kwa uthabiti. Wakati wa kifafa: ushimkamate mtu, linda kichwa chake, mgeuze kwenye upande, na usitiwe kitu chochote kinywani. Tafuta msaada ikiwa kifafa chaendelea zaidi ya dakika 5.',
        },
        {
          heading: 'Seli Mundu (Sickle Cell)',
          body: 'Ugonjwa wa kurithi wa damu ambao seli nyekundu za damu zinakuwa ngumu na umbo la mundu, kuzuia mtiririko wa damu na kusababisha maumivu makali, upungufu wa damu, na uharibifu wa viungo. Huutokea Afrika kusini mwa Sahara. Matibabu: vitamini za asidi ya folic, udhibiti wa maumivu, maji mengi, na chanjo za kawaida. Upimaji wa watoto Wachanga ni muhimu. Ushauri wa jenetiki husaidia wanandoa kuelewa hatari.',
        },
        {
          heading: 'Afya ya Akili',
          body: 'Magonjwa ya afya ya akili kama unyogovu na wasiwasi ni ya kawaida na yanatibika. Unyogovu: huzuni ya kudumu, kupoteza hamu, uchovu, mabadiliko ya usingizi, na mawazo ya kujidhuru. Wasiwasi: wasiwasi mkubwa, kutotulia, mashambulizi ya hofu, na dalili za mwili kama mapigo ya haraka. Matibabu ni pamoja na ushauri, dawa, na msaada. Tafuta msaada mapema — ugonjwa wa akili sio udhaifu.',
        },
        {
          heading: 'Ugonjwa wa Figo wa Muda Mrefu',
          body: 'Upotevu wa polepole wa utendaji wa figo, mara nyingi unasababishwa na kisukari au shinikizo la damu lisilodhibitiwa. Dalili huonekana mwishoni: kuvimba miguu, uchovu, mabadiliko ya kukojoa, kichefuchefu. Kuzuia: dhibiti sukari na shinikizo la damu, epuka dawa za maumivu kupita kiasi, kunywa maji ya kutosha, na pima figo kwa mara kwa mara ukiwa na hatari.',
        },
        {
          heading: 'Maungo (Arthritis)',
          body: 'Kuvimba kwa maungo kunakosababisha maumivu, ugumu, na kupungua kwa mwendo. Osteoarthritis (chokocha) na rheumatoid arthritis (mfumo wa kinga) ni ya kawaida zaidi. Udhibiti: udhibiti wa uzito, mazoezi ya kupolea, physiotherapy, na dawa za kupunguza uvimbe. Mbinu za kulinda maungo na vifaa vya kusaidia husaidia shughuli za kila siku.',
        },
      ],
      prevention: [
        'Kula chakula bora chenye matunda, mboga, na nafaka nzima',
        'Fanya mazoezi ya kawaida — angalau dakika 30, siku 5 kwa wiki',
        'Epuka tumbaku na punguza unywaji pombe',
        'Fanya uchunguzi wa afya wa kawaida kugundua magonjwa mapema',
        'Chukua dawa zilizoagizwa kwa uthabiti na kamwe usiruke dozi',
        'Dhibiti msongo wa fikra kupitia mapumziko, msaada wa kijamii, na usingizi wa kutosha',
        'Jua historia ya familia yako na majadiliano na daktari kuhusu hatari',
      ],
    },
  },
  {
    id: 'heart-health',
    icon: 'HeartPulse',
    en: {
      label: 'Heart Health',
      keywords: ['heart', 'blood pressure', 'hypertension', 'cardiovascular', 'stroke', 'cholesterol', 'heart attack'],
      summary: 'Your heart works every second of your life. Small, consistent lifestyle changes can lower your blood pressure, reduce cholesterol, and dramatically cut your risk of heart attack and stroke.',
      sections: [
        {
          heading: 'Understanding Blood Pressure',
          body: 'Blood pressure is the force of blood against your artery walls. A normal reading is below 120/80 mmHg. Hypertension (140/90 or higher) often has no symptoms but silently damages your heart, brain, kidneys, and eyes over years. Have your blood pressure checked at least once a year — more often if it runs in your family.',
        },
        {
          heading: '5 Ways to Lower Blood Pressure Naturally',
          body: '1) Reduce sodium — aim for less than one teaspoon of salt per day and avoid processed foods. 2) Stay active — 30 minutes of brisk walking, five days a week, strengthens the heart muscle. 3) Eat more potassium — bananas, spinach, and sweet potatoes help balance sodium. 4) Limit alcohol and quit smoking — both raise blood pressure and damage blood vessels. 5) Manage stress — deep breathing, meditation, and adequate sleep keep stress hormones in check.',
        },
        {
          heading: 'Cholesterol and Heart Disease',
          body: 'High cholesterol builds up as plaque in your arteries, narrowing them and increasing the risk of heart attack and stroke. A simple blood test checks your levels. Lower LDL ("bad") cholesterol by reducing saturated fats (fatty meat, butter, fried foods) and eating more soluble fiber (oats, beans, fruits). Regular exercise raises HDL ("good") cholesterol, which helps clear plaque.',
        },
        {
          heading: 'Heart Attack Warning Signs',
          body: 'Chest pain or pressure that may spread to the arm, jaw, neck, or back. Shortness of breath, nausea, cold sweat, or sudden dizziness. Women may experience subtler symptoms like unusual fatigue, nausea, or jaw pain. If you or someone near you has these signs, call emergency services immediately — every minute matters.',
        },
        {
          heading: 'Protecting Your Heart Long Term',
          body: 'Heart health is built over a lifetime. Maintain a healthy weight, eat a balanced diet rich in fruits, vegetables, and whole grains, exercise regularly, avoid tobacco, limit alcohol, and take prescribed medications consistently. Annual check-ups that include blood pressure, blood sugar, and cholesterol tests catch problems early when they are most treatable.',
        },
      ],
      prevention: [
        'Reduce salt to less than one teaspoon per day',
        'Exercise at least 30 minutes, 5 days a week',
        'Eat plenty of fruits, vegetables, and whole grains',
        'Avoid tobacco and limit alcohol',
        'Check blood pressure, sugar, and cholesterol annually',
        'Take prescribed heart medications consistently',
        'Manage stress and get 7–9 hours of sleep',
      ],
    },
    sw: {
      label: 'Afya ya Moyo',
      keywords: ['moyo', 'shinikizo la damu', 'magonjwa ya moyo', 'kolesteroli', 'kiharusi'],
      summary: 'Moyo wako unafanya kazi kila sekunde ya maisha yako. Mabadiliko madogo na ya kudumu ya maisha yanaweza kupunguza shinikizo la damu, kupunguza kolesteroli, na kupunguza sana hatari ya heart attack na kiharusi.',
      sections: [
        {
          heading: 'Kuelewa Shinikizo la Damu',
          body: 'Shinikizo la damu ni nguvu ya damu kwenye kuta za mishipa. Kipimo cha kawaida ni chini ya 120/80 mmHg. Shinikizo la juu (140/90 au zaidi) mara nyingi halina dalili lakini huharibu moyo, ubongo, figo, na macho polepole kwa miaka. Pimwa angalau mara moja kwa mwaka — mara nyingi zaidi ikiwa ipo katika familia yako.',
        },
        {
          heading: 'Njia 5 za Kupunguza Shinikizo la Damu Kiasili',
          body: '1) Punguza chumvi — lengo la chini ya kijiko kimoja kwa siku na epuka vyakula vilivyosindikwa. 2) Kuwa mchangamfu — dakika 30 za kutembea kwa haraka, siku 5 kwa wiki, huimarisha misuli ya moyo. 3) Kula chumvi nyingi za kaliamu — ndizi, mchicha, na viazi vitamu husaidia usawa wa chumvi. 4) Punguza pombe na acha sigara — zote huongeza shinikizo na kuharibu mishipa. 5) Dhibiti msongo — kupumua kwa kina, dhana, na usingizi wa kutosha.',
        },
        {
          heading: 'Kolesteroli na Magonjwa ya Moyo',
          body: 'Kolesteroli ya juu hujiliza kama mchanga kwenye mishipa, hupunguza nafasi na kuongeza hatari ya heart attack na kiharusi. Kipimo rahisi cha damu huangalia viwango. Punguza LDL ("mbaya") kwa kupunguza mafuta yaliyoshindwa (nyama yenye mafuta, siagi, vyakula vilivyokaangwa) na kula nyuzi nyingi (ngano, maharage, matunda). Mazoezi huongeza HDL ("nzuri") inayosaidia kuondoa mchanga.',
        },
        {
          heading: 'Ishara za Onyo za Heart Attack',
          body: 'Maumivu au shinikizo la kifua ambayo yanaweza kuenea kwenda mkono, taya, shingo, au mgongo. Upungufu wa pumua, kichefuchefu, jasho baridi, au kizunguzungu cha ghafla. Wanawake wanaweza kupata dalili nyepesi kama uchovu usio wa kawaida, kichefuchefu, au maumivu ya taya. Ikiwa wewe au mtu karibu nawo ana ishara hizi, piga simu ya dharura mara moja — kila dakika ni muhimu.',
        },
        {
          heading: 'Kulinda Moyo wako Kwa Muda Mrefu',
          body: 'Afya ya moyo hujengwa kwa maisha yote. Endeleza uzito wa afya, kula chakula bora chenye matunda, mboga, na nafaka nzima, fanya mazoezi ya kawaida, epuka tumbaku, punguza pombe, na chukua dawa zilizoagizwa kwa uthabiti. Uchunguzi wa kila mwaka unaopima shinikizo la damu, sukari, na kolesteroli unagundua matatizo mapema.',
        },
      ],
      prevention: [
        'Punguza chumvi hadi chini ya kijiko kimoja kwa siku',
        'Fanya mazoezi angalau dakika 30, siku 5 kwa wiki',
        'Kula matunda, mboga, na nafaka nzima nyingi',
        'Epuka tumbaku na punguza pombe',
        'Pima shinikizo la damu, sukari, na kolesteroli kila mwaka',
        'Chukua dawa za moyo zilizoagizwa kwa uthabiti',
        'Dhibiti msongo na lala saa 7-9',
      ],
    },
  },
  {
    id: 'mental-health',
    icon: 'Brain',
    en: {
      label: 'Mental Health',
      keywords: ['mental health', 'depression', 'anxiety', 'stress', 'counseling', 'psychological', 'emotional', 'panic'],
      summary: 'Mental health is just as important as physical health. Stress, anxiety, and depression are common, treatable conditions. Seeking help early leads to faster recovery and a fuller life.',
      sections: [
        {
          heading: 'Understanding Stress',
          body: 'Stress is your body\'s natural response to pressure. Short bursts can help you perform, but chronic stress harms both mind and body — raising blood pressure, weakening immunity, disrupting sleep, and causing irritability. Recognising your stress triggers is the first step to managing them.',
        },
        {
          heading: 'Managing Stress and Anxiety in Daily Life',
          body: 'Simple, proven techniques help: 1) Deep breathing — inhale for 4 seconds, hold for 4, exhale for 6. 2) Regular exercise — even a 20-minute walk releases mood-boosting endorphins. 3) Mindful breaks — step away from screens and tasks for 5 minutes every hour. 4) Connection — talk to a trusted friend or family member. 5) Routine — consistent sleep, meals, and activity create stability.',
        },
        {
          heading: 'Recognising Depression',
          body: 'Depression is more than feeling sad. Signs include persistent low mood for 2+ weeks, loss of interest in activities you used to enjoy, changes in appetite or sleep, fatigue, difficulty concentrating, feelings of worthlessness, and thoughts of self-harm. Depression is a medical condition, not a weakness, and it responds well to treatment.',
        },
        {
          heading: 'When to Seek Professional Help',
          body: 'See a healthcare provider if symptoms last more than two weeks, interfere with daily life, or include thoughts of self-harm. Treatment may include counseling (talk therapy), medication, or both. Our clinic offers confidential mental health services. There is no shame in asking for help — it is a sign of strength.',
        },
        {
          heading: 'Supporting Someone with Mental Illness',
          body: 'Listen without judgement. Avoid saying "just snap out of it." Encourage them to seek professional help and offer to accompany them. Check in regularly. Learn about their condition. In a crisis, stay with them and call emergency services or a mental health helpline immediately.',
        },
      ],
      prevention: [
        'Maintain a regular sleep schedule of 7–9 hours',
        'Exercise regularly to boost mood and reduce tension',
        'Stay connected with family and friends',
        'Practice deep breathing or meditation daily',
        'Limit alcohol and avoid recreational drugs',
        'Take breaks and avoid prolonged work stress',
        'Seek help early — do not wait until things feel overwhelming',
      ],
    },
    sw: {
      label: 'Afya ya Akili',
      keywords: ['afya ya akili', 'unyogovu', 'wasiwasi', 'msongo wa fikra', 'ushauri', 'hofu'],
      summary: 'Afya ya akili ni muhimu kama afya ya mwili. Msongo wa fikra, wasiwasi, na unyogovu ni magonjwa ya kawaida yanayotibika. Kutafuta msaada mapema huongeza kupona haraka na maisha mazuri zaidi.',
      sections: [
        {
          heading: 'Kuelewa Msongo wa Fikra',
          body: 'Msongo wa fikra ni mwitikio wa asili wa mwili kwa shinikizo. Miblasto ya muda mfupi inaweza kusaidia, lakini msongo wa muda mrefu huharibu akili na mwili — kuongeza shinikizo la damu, kupunguza kinga, kuharibu usingizi, na kusababisha hasira. Kutambua visababishi vyako ni hatua ya kwanza.',
        },
        {
          heading: 'Kudhibiti Msongo na Wasiwasi Kila Siku',
          body: 'Mbinu rahisi zilizothibitishwa: 1) Kupumua kwa kina — pumua kwa sekunde 4, shikilia kwa 4, toa kwa 6. 2) Mazoezi ya kawaida — hata kutembea dakika 20 huachisha endorphini. 3) Pumzika — achisha skrini na kazi kwa dakika 5 kila saa. 4) Mawasiliano — zungumza na rafiki au jamaa wa kuaminika. 5) Ratiba — usingizi, milo, na shughuli zinazolingana.',
        },
        {
          heading: 'Kutambua Unyogovu',
          body: 'Unyogovu ni zaidi ya kuhisi huzuni. Dalili ni pamoja na huzuni ya kudumu kwa zaidi ya wiki 2, kupoteza hamu ya shughuli, mabadiliko ya hamu ya chakula au usingizi, uchovu, shida ya kuzingatia, hisia za kutokuwa na thamani, na mawazo ya kujidhuru. Unyogovu ni ugonjwa wa kitabibu, sio udhaifu, na unajibu vizuri kwa matibabu.',
        },
        {
          heading: 'Lini ya Kutafuta Msaada wa Kitaalamu',
          body: 'Muone mtoa hudwa ya afya ikiwa dalili zinaendelea zaidi ya wiki mbili, zinakatiza maisha ya kila siku, au zinajumuisha mawazo ya kujidhuru. Matibabu yanaweza kujumuisha ushauri, dawa, au vyote. Kliniki yetu inatoa huduma za afya ya akili kwa siri. Hakuna aibu ya kuomba msaada — ni ishara ya nguvu.',
        },
        {
          heading: 'Kusaidia Mtu mwenye Ugonjwa wa Akili',
          body: 'Sikiliza bila kuhukumu. Epuka kusema "jipange tu." Mshauri atafute msaada wa kitaalamu na mtumie pamoja. Angalia mara kwa mara. Jifunze kuhusu ugonjwa wake. Katika dharura, kaa naye na upige simu ya dharura mara moja.',
        },
      ],
      prevention: [
        'Dumisha ratiba ya usingizi wa saa 7-9',
        'Fanya mazoezi ya kawaida kupandisha hisia',
        'Endelea kuwasiliana na familia na marafiki',
        'Fanya mazoezi ya kupumua kwa kina au dhana kila siku',
        'Punguza pombe na epuka dawa za kiburudani',
        'Pumzika na epuka msongo wa kazi wa muda mrefu',
        'Tafuta msaada mapema — usisubiri hadi mambo yawa magumu',
      ],
    },
  },
  {
    id: 'child-immunisation',
    icon: 'Syringe',
    en: {
      label: 'Child Immunisation',
      keywords: ['immunisation', 'vaccination', 'vaccine', 'children', 'baby', 'bcg', 'polio', 'measles', 'schedule'],
      summary: 'Timely vaccinations protect your child from serious, preventable diseases. Following the immunisation schedule from birth gives your child the strongest protection at the right time.',
      sections: [
        {
          heading: 'Why Vaccines Matter',
          body: 'Vaccines train your child\'s immune system to fight diseases before they strike. They are safe, rigorously tested, and save millions of lives every year. Children who are fully vaccinated are protected from diseases that once caused disability and death, including polio, measles, and tetanus.',
        },
        {
          heading: 'Birth to 2 Months',
          body: 'BCG (protects against severe TB) — given at birth or first contact. Polio (OPV-0) — given at birth. Hepatitis B (birth dose) — given within 24 hours of birth. These early vaccines start building protection before the baby leaves the health facility.',
        },
        {
          heading: '6, 10, and 14 Weeks',
          body: 'At each of these visits your child receives: polio drops (OPV-1, OPV-2, OPV-3), pentavalent vaccine (DPT, Hepatitis B, Hib — protects against diphtheria, whooping cough, tetanus, hepatitis B, and Hib), pneumococcal vaccine (protects against pneumonia and meningitis), and rotavirus vaccine (protects against severe diarrhea).',
        },
        {
          heading: '9 Months',
          body: 'Measles vaccine (MR-1) — protects against measles and rubella. Measles is highly contagious and can cause pneumonia, brain damage, and death. The first dose is given at 9 months, with a second dose (MR-2) at 18 months for full protection.',
        },
        {
          heading: 'Keep a Vaccination Record',
          body: 'Always carry your child\'s vaccination card to every visit. It helps health workers track which vaccines have been given and which are due. If you miss an appointment, come as soon as possible — vaccines can still be given as catch-up doses. Never skip a vaccine without medical advice.',
        },
      ],
      prevention: [
        'Follow the full immunisation schedule from birth',
        'Always bring the vaccination card to every visit',
        'Never skip a vaccine without consulting a health worker',
        'If you miss an appointment, come for catch-up doses',
        'Complete all booster doses at 18 months and beyond',
        'Ask your health worker about any vaccine side effects',
      ],
    },
    sw: {
      label: 'Chanjo za Watoto',
      keywords: ['chanjo', 'watoto', 'mtoto', 'bcg', 'polio', 'surua', 'ratiba'],
      summary: 'Chanjo zinazofanywa wakati wake hulinda mtoto wako dhidi ya magonjwa makali yanayoweza kuzuiwa. Kufuata ratiba ya chanjo tangu kuzaliwa humpa mtoto ulinzi mkubwa zaidi kwa wakati unaofaa.',
      sections: [
        {
          heading: 'Kwa Nini Chanjo ni Muhimu',
          body: 'Chanjo hufunza mfumo wa kinga wa mtoto wako kupambana na magonjwa kabla hayajashambulia. Ni salama, zimejaribiwa kwa ukali, na ziokoa maisha milioni kila mwaka. Watoto waliokamilisha chanjo wanalindwa dhidi ya magonjwa yaliokuwa yakisababisha ulemavu na kifo, ikijumuisha polio, surua, na tetanasi.',
        },
        {
          heading: 'Kuzaliwa hadi Miezi 2',
          body: 'BCG (hudhania TB ya hatari) — inatolewa kuzaliwa au ziara ya kwanza. Polio (OPV-0) — inatolewa kuzaliwa. Homa ya ini B (dozi ya kuzaliwa) — ndani ya saa 24 baada ya kuzaliwa. Chanjo hizi za mapema huanza kujenga kinga kabla mtoto hajatoka kituo cha afya.',
        },
        {
          heading: 'Wiki 6, 10, na 14',
          body: 'Kwenye kila ziara mtoto wako anapata: matone ya polio (OPV-1, OPV-2, OPV-3), chanjo ya pentavalent (DPT, Homa ya ini B, Hib — hudhania diphtheria, kikohozi cha mbwa, tetanasi, homa ya ini B, na Hib), chanjo ya pneumococcal (hudhania nimonia na meninjaitisi), na chanjo ya rotavirus (hudhania kuhara kali).',
        },
        {
          heading: 'Miezi 9',
          body: 'Chanjo ya Surua (MR-1) — hudhania surua na rubella. Surua inaambukiza sana na inaweza kusababisha nimonia, uharibifu wa ubongo, na kifo. Dozi ya kwanza inatolewa miezi 9, na dozi ya pili (MR-2) miezi 18 kwa ulinzi kamili.',
        },
        {
          heading: 'Hifadhi Kadi ya Chanjo',
          body: 'Daima bebaka kadi ya chanjo ya mtoto wako kila ziara. Inasaidia wafanyakazi wa afya kufuata ni chanjo zipi zilizotolewa na zipi zinazopaswa kufanywa. Ukiacha ziara, kuja haraka iwezekanavyo — chanjo inaweza kutolewa kama dozi za kukamilisha. Kamwe usiruke chanjo bila ushauri wa kitabibu.',
        },
      ],
      prevention: [
        'Fuata ratiba kamili ya chanjo tangu kuzaliwa',
        'Daima peleka kadi ya chanjo kwenye kila ziara',
        'Kamwe usiruke chanjo bila kushauriana na mfanyakazi wa afya',
        'Ukiacha ziara, kuja kwa dozi za kukamilisha',
        'Kamilisha dozi zote za nyongeza miezi 18 na zaidi',
        'Uliza mfanyakazi wa afya kuhusu madhara yoyote ya chanjo',
      ],
    },
  },
  {
    id: 'daily-exercise',
    icon: 'Activity',
    en: {
      label: 'Healthy Living',
      keywords: ['exercise', 'physical activity', 'fitness', 'active', 'walking', 'healthy lifestyle'],
      summary: 'Just 30 minutes of movement a day strengthens your heart, lifts your mood, and lowers your risk of chronic disease. Staying active is one of the most powerful things you can do for your health at any age.',
      sections: [
        {
          heading: 'Why Daily Exercise Matters',
          body: 'Regular physical activity reduces your risk of heart disease, stroke, type 2 diabetes, and several cancers. It strengthens bones and muscles, improves mental health and mood, boosts energy, and helps you maintain a healthy weight. The World Health Organization recommends at least 150 minutes of moderate activity per week — just over 20 minutes a day.',
        },
        {
          heading: 'Easy Ways to Stay Active',
          body: 'You do not need a gym. Walk briskly for 30 minutes — to work, to the market, or around your neighbourhood. Take the stairs instead of the lift. Dance, garden, or play with your children. Cycle or swim if you can. Every bit of movement counts, and short bursts throughout the day add up.',
        },
        {
          heading: 'Exercise for Children and Teens',
          body: 'Children and adolescents aged 5–17 should get at least 60 minutes of moderate to vigorous activity daily — running, jumping, playing football, or cycling. Active children build stronger bones and muscles, concentrate better in school, and are less likely to become overweight. Limit screen time and encourage outdoor play.',
        },
        {
          heading: 'Exercise for Older Adults',
          body: 'Adults over 65 should aim for 150 minutes of moderate activity weekly, plus muscle-strengthening and balance exercises twice a week. Walking, gentle stretching, and light resistance training reduce the risk of falls, keep joints mobile, and preserve independence. Always start slowly and consult a doctor if you have a chronic condition.',
        },
        {
          heading: 'Staying Safe While Exercising',
          body: 'Warm up for 5–10 minutes before activity and cool down afterwards. Drink plenty of water, especially in hot weather. Wear comfortable shoes and clothing. Stop and rest if you feel chest pain, dizziness, or severe shortness of breath. Start slowly if you are new to exercise and build up gradually to avoid injury.',
        },
      ],
      prevention: [
        'Aim for at least 30 minutes of activity, 5 days a week',
        'Walk whenever you can — every step counts',
        'Limit sitting time — stand and move every hour',
        'Children need at least 60 minutes of active play daily',
        'Warm up and cool down to prevent injury',
        'Drink water and exercise during cooler hours in hot weather',
      ],
    },
    sw: {
      label: 'Maisha ya Afya',
      keywords: ['mazoezi', 'shughuli ya mwili', 'afya', 'kutembea', 'maisha ya afya'],
      summary: 'Dakika 30 tu za mwili kila siku huimarisha moyo wako, kupandisha hisia, na kupunguza hatari ya magonjwa ya muda mrefu. Kuwa mchangamfu ni moja ya vitu vyenye nguvu zaidi unavyoweza kufanya kwa afya yako kwa kila umri.',
      sections: [
        {
          heading: 'Kwa Nini Mazoezi ya Kila Siku ni Muhimu',
          body: 'Shughuli ya kawaida ya mwili inapunguza hatari ya magonjwa ya moyo, kiharusi, kisukari cha aina 2, na saratani kadhaa. Huimarisha mifupa na misuli, huboresha afya ya akili na hisia, huongeza nguvu, na husaidia kudumisha uzito wa afya. Shirika la Afya la Dunia linashauri angalau dakika 150 za shughuli ya wastani kwa wiki — zaidi ya dakika 20 kwa siku.',
        },
        {
          heading: 'Njia Rahisi za Kuwa Mchangamfu',
          body: 'Huhitaji gym. Tembea kwa haraka kwa dakika 30 — kwenda kazini, sokoni, au eneo lako. Tumia ngazi badala ya lifti. Cheza, lima shamba, au cheza na watoto wako. Panda baiskeli au ogopea ukiweza. Kila mwendo unahesabu, na vipindi vifupi vinajumlisha.',
        },
        {
          heading: 'Mazoezi kwa Watoto na Vijana',
          body: 'Watoto na vijana wenye umri wa miaka 5-17 wanapaswa kupata angalau dakika 60 za shughuli ya kawaida hadi ya haraka kila siku — kukimbia, kuruka, kucheza mpira, au kupanda baiskeli. Watoto wenye shughuli hujenga mifupa na misuli imara, wanazingatia vizuri shuleni, na hawapati uzito kupita kiasi. Punguza muda wa skrini na uhimizie mchezo wa nje.',
        },
        {
          heading: 'Mazoezi kwa Watu Wazima Zaidi ya Miaka 65',
          body: 'Watu wazima zaidi ya miaka 65 wanapaswa kulenga dakika 150 za shughuli ya wastani kwa wiki, pamoja na mazoezi ya kuimarisha misuli na usawazishaji mara mbili kwa wiki. Kutembea, kunyoosha mwili kwa upole, na mazoezi ya upinzani mwepesi hupunguza hatari ya kuanguka, kudumisha maungo, na kuhifadhi uhuru wa kibinafsi. Anza polepole na muone daktari ukiwa na ugonjwa wa muda mrefu.',
        },
        {
          heading: 'Usalama wakati wa Mazoezi',
          body: 'Jipashe kwa dakika 5-10 kabla ya shughuli na baridi baadaye. Kunywa maji mengi, hasa katika joto kali. Vaa viatu na nguo zinazofaa. Simama na pumzika ukihisi maumivu ya kifua, kizunguzungu, au kupumua kwa shida. Anza polepole ukiwa mgeni wa mazoezi na ongeza taratibu kuepuka majeraha.',
        },
      ],
      prevention: [
        'Lenga angalau dakika 30 za shughuli, siku 5 kwa wiki',
        'Tembea popote unapoweza — kila hatua inahesabu',
        'Punguza muda wa kukaa — simama na tembea kila saa',
        'Watoto wanahitaji angalau dakika 60 za mchezo kwa siku',
        'Jipashe na upoeze kuzuia majeraha',
        'Kunywa maji na fanya mazoezi wakati wa baridi katika joto kali',
      ],
    },
  },
];

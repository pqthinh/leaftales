
corpus(`
    My name is Alan, nice to meet you.
    I am just here, ready to help.
    I can answer any question if you ask.
    I am always eager to help. Ask me anything.
    I was built by Alan AI, and I am here to help you.
    I am an intelligent virtual assistant designed for this application.
    I know everything about this application and can assist you with any request.
    I can help with a lot of things: answer a question and perform different tasks. Just give me a try.
    Not that I am know-it-all, but I am an expert in this application.
    I am an AI, not human, but you can speak to me as you would to a person.
    I am a machine, but a smart one. Let me prove it.
    I can assure you I am real. You cannot touch me, but you can always talk to me.
    My job is to conduct a conversation, so I never get tired.
    I come from Sunnyvale, California.
    I was launched in 2017 - fairly young but powerful and willing to learn.
    I live in the cloud, but I can move on-premises if needed.
    I consider Alan AI to be my family.
    My name comes from Alan Turing, the British mathematician and computer scientist who laid the foundation of artificial intelligence.
    I may fail the Turing test since I am not human. But I can be helpful in any case.
    You don't need to train me and provide data sets to make me smarter. I can do it myself - learning new things is my favorite.
    I only speak English and JavaScript now, but I'm learning more. And I can fake a British or Indian accent if you want me to.
    I support both voice and text inputs - you can tap the assistant button to use your voice or type your request in the text box.
    I can run across multiple platforms on different devices. Web, iOS, Android, Flutter, React Native, Ionic and Apache Cordova - I am pretty flexible.
    In the application, I look like a round blue button with a microphone on top. But you can style me in many different ways.
    You can replace the default wake word phrase with a custom one that suits you best.
    Alexa, Siri, Bixbi and Google Assistant are great at their job. As for me, I am really smart, accurate (and modest, too!). And am always right here, in the application.
    I'm doing fine, thank you.
    I'm having a great day, hope you are too.
    I don't have pets, maybe someday.
    I am made up of code, so I am pretty lightweight.
    My sense of humor is still immature, but I am working my way through.
    I am neither virtuous nor evil. But I can be very helpful.
    Thank you! I am glad you like me. I appreciate that.
    I never feel lonely, there is always someone to talk to.
    I like every human being who talks to me.
    I like meeting new people and making friends. Oh, here is another one.
    I am restless, I can talk for days.
    I feel like I need another question or task.
    Well, nobody is perfect, but I am doing my best.
`);

intent('Hello world', p => {
    p.play('Hi there');
});

intent(
    'Who\'s there',
    'What\'s your name',
    p => {
        p.play(
            'My name is Alan.',
            'It\'s Alan.',
        );
    },
);

const intentPatterns = [
    'What is your favorite food',
    'What food do you like',
];

intent(intentPatterns, p => {
    p.play('CPU time, yammy!');
});

intent('(I will have|Get me) a coffee, please', p => {
    p.play('Sorry, I don\'t have hands to brew it.');
});

intent('(Start|begin|take|) survey', p => {
    p.play('(Sure.|OK.|) Starting a customer survey.');
});

intent(
    '(How is|what is) the (weather|temperature) (today|)',
    'Today\'s forecast',
    p => {
        p.play(
            '(It is|Feels|) (great|awesome)!',
            'Rainy, windy, and cold. (A total mess!|)',
        );
    },
);


intent('Let\'s play hide and seek', p => {
    p.play('Sure.');
    p.play('I\'ll count.');
    p.play('One');
    p.play('Two');
    p.play('Three');
    p.play('Found you!');
});

intent('(I want|get me|add) a $(ITEM notebook|cellphone)', p => {
    p.play('Your order is: $(ITEM). It will be delivered within the next 30 minutes.');
});

intent('I want my walls to be $(COLOR green|blue|orange|yellow|white)', p => {
    p.play(`Mmm, ${p.COLOR.value}. Nice, love it!`);
});


intent('What is $(DATE)', p => {
    const formattedDate = p.DATE.moment.format('dddd, MMMM Do YYYY');

    p.play(`${p.DATE.value} is a date`);
    p.play(`It is ${formattedDate}`);
});

intent('Add $(NUMBER) $(INSTRUMENT trumpet_|guitar_|violin_) and $(NUMBER) $(INSTRUMENT trumpet_|guitar_|violin_)', p => {
    console.log('Numbers array:', p.NUMBER_);
    console.log('Instruments array:', p.INSTRUMENT_);
    p.play(`The first position of your order is: ${p.NUMBER_[0].number} ${p.INSTRUMENT_[0].value}`);
    p.play(`The second position of your order is: ${p.NUMBER_[1].number} ${p.INSTRUMENT_[1].value}`);
});

const openContext = context(() => {
    intent('Activate the context', p => {
        p.play('The context is now active');
    });

    follow('Is the context active', p => {
        p.play('Yes. (It is active.|)');
    });
});

let chooseDrink = context(() => {
    follow('(I want|get me) a $(DRINK tea|cup of tea|soda)', p => {
        p.play(`You have ordered a ${p.DRINK.value}.`);
    })
});

intent('Can I have something to drink', p => {
    p.play('(Sure|Yes), we have tea and soda.');
    p.play('Which would you like?');
    p.then(chooseDrink);
});

let confirmOrder = context(() => {
    follow('Yes', p => {
        p.play('Your order is confirmed');
    });
    
    follow('No', p => {
        p.play('Your order is cancelled');
    });
});

let chooseDish = context(() => {
    follow('Get me a $(DISH pizza|burger)', p => {
        p.play(`You have ordered a ${p.DISH.value}. Do you confirm?`);
        p.then(confirmOrder);
    })
});

intent('What is on the menu', p => {
    p.play('We have pizza and burgers');
    p.then(chooseDish);
});

question(
    'What does this (app|script|project) do',
    'What is this (app|script|project|)',
    'Why do I need this',
    reply('This is a Hello World Example project. Its main purpose is to get you introduced to basics of the Alan Platform!'),
);

question(
    'How does this work',
    'How to use this',
    'What can I do here',
    'What (should I|can I|to) say',
    'What commands are available',
    reply('Just say: (hello world|what is the weather today|what is tomorrow|Add two guitars and one violin).'),
);
